import { utapi } from '@/server/uploadthing'

export type CarpetAnalysis = {
  sameProduct: boolean
  productConfidence: number
  title: string
  description: string
  category: string | null
  design: string | null
  material: string | null
  dominantColors: string[]
  pattern: string | null
  dimensions: string[]
  variants: Array<{
    dimension: string
    color: string
  }>
  uncertainFields: string[]
  confidence: number
  marketingAngles: string[]
}

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    sameProduct: { type: 'boolean' },
    productConfidence: { type: 'number' },
    title: { type: 'string' },
    description: { type: 'string' },
    category: { type: ['string', 'null'] },
    design: { type: ['string', 'null'] },
    material: { type: ['string', 'null'] },
    dominantColors: { type: 'array', items: { type: 'string' } },
    pattern: { type: ['string', 'null'] },
    dimensions: { type: 'array', items: { type: 'string' } },
    variants: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          dimension: { type: 'string' },
          color: { type: 'string' },
        },
        required: ['dimension', 'color'],
      },
    },
    uncertainFields: { type: 'array', items: { type: 'string' } },
    confidence: { type: 'number' },
    marketingAngles: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'sameProduct',
    'productConfidence',
    'title',
    'description',
    'category',
    'design',
    'material',
    'dominantColors',
    'pattern',
    'dimensions',
    'variants',
    'uncertainFields',
    'confidence',
    'marketingAngles',
  ],
} as const

export async function uploadRubikaImages(urls: string[]) {
  const results = await utapi.uploadFilesFromUrl(urls)
  const list = Array.isArray(results) ? results : [results]

  return list
    .map((result) => result.data?.url)
    .filter((url): url is string => Boolean(url))
}

export async function analyzeCarpetImages(
  imageUrls: string[],
  caption?: string,
): Promise<CarpetAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured')

  const model = process.env.OPENAI_VISION_MODEL || 'gpt-5.6-luna'

  const content = [
    {
      type: 'input_text',
      text: [
        'You are the product analyst for a Persian carpet ecommerce store.',
        'Analyze all supplied images together and decide whether they show the same carpet/product.',
        'Extract only facts visually supported by the images or the supplied caption.',
        'Never invent exact dimensions, material, density, pile height, knot count, price, origin, or manufacturing method.',
        'If a field is not reliably visible, return null and add its name to uncertainFields.',
        'Write the title and description in Persian.',
        'The description must be suitable for a product draft, not an exaggerated advertisement.',
        caption ? `Rubika caption: ${caption}` : '',
      ].filter(Boolean).join('\\n'),
    },
    ...imageUrls.map((image_url) => ({
      type: 'input_image',
      image_url,
      detail: 'high',
    })),
  ]

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: [{ role: 'user', content }],
      text: {
        format: {
          type: 'json_schema',
          name: 'carpet_analysis',
          strict: true,
          schema,
        },
      },
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`OpenAI analysis failed: ${response.status} ${body.slice(0, 500)}`)
  }

  const data = (await response.json()) as { output_text?: string }
  if (!data.output_text) throw new Error('OpenAI returned no output_text')

  return JSON.parse(data.output_text) as CarpetAnalysis
}
