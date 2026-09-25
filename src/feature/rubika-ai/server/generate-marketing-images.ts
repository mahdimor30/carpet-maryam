import { UTApi } from 'uploadthing/server'

const utapi = new UTApi()

async function generateOne(imageUrl: string, prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured')

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1',
      input: [{
        role: 'user',
        content: [
          { type: 'input_text', text: prompt },
          { type: 'input_image', image_url: imageUrl, detail: 'high' },
        ],
      }],
      tools: [{
        type: 'image_generation',
        action: 'generate',
        size: '1024x1024',
        quality: 'medium',
        output_format: 'webp',
      }],
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI image generation failed: ${response.status} ${(await response.text()).slice(0, 300)}`)
  }

  const data = await response.json() as { output?: Array<{ type?: string; result?: string }> }
  const result = data.output?.find((item) => item.type === 'image_generation_call')?.result
  if (!result) return null

  const bytes = Uint8Array.from(atob(result), (char) => char.charCodeAt(0))
  const upload = await utapi.uploadFiles(new File([bytes], `carpet-${Date.now()}.webp`, { type: 'image/webp' }))
  const item = Array.isArray(upload) ? upload[0] : upload
  return item.data?.url ?? null
}

export async function generateMarketingImages(imageUrl: string, title: string) {
  const jobs = [
    {
      kind: 'product' as const,
      prompt: `Create a clean premium ecommerce product photo of the exact Persian carpet in the reference image. Preserve the carpet design, colors, proportions and details exactly. Place it flat and centered on a clean warm neutral studio background. No people, no text, no logos. Product photography for the Persian carpet store "فرش مریم". Product title: ${title}.`,
    },
    {
      kind: 'interior' as const,
      prompt: `Create a realistic high-end interior design scene using the exact Persian carpet from the reference image. Preserve its pattern and colors faithfully. Put it naturally under furniture in a tasteful Persian-modern living room with warm daylight. No people, no text, no logos. The carpet must remain the visual focus. Product: ${title}.`,
    },
    {
      kind: 'advertisement' as const,
      prompt: `Create a premium social-media advertising image using the exact Persian carpet from the reference image. Preserve the carpet's design and colors. Use an elegant warm Persian aesthetic, strong composition, clean negative space and commercial product photography. No text, no fake specifications, no logos, no people. Product: ${title}.`,
    },
  ]

  const output: Array<{ kind: 'product' | 'interior' | 'advertisement'; url: string }> = []
  for (const job of jobs) {
    const url = await generateOne(imageUrl, job.prompt)
    if (url) output.push({ kind: job.kind, url })
  }
  return output
}
