import { eq, asc } from 'drizzle-orm'
import { getDb } from '@/server/db'
import {
  productDraftImages,
  productDrafts,
  rubikaIngestBatches,
  rubikaIngestImages,
} from '@/server/db/schema'
import { analyzeCarpetImages, uploadRubikaImages } from './analyze-carpet'
import { getRubikaFileUrl, sendRubikaMessage } from './rubika-client'
import { generateMarketingImages } from './generate-marketing-images'

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

export async function processRubikaBatch(batchId: number) {
  const db = getDb()

  const batch = await db.query.rubikaIngestBatches.findFirst({
    where: (b, { eq }) => eq(b.id, batchId),
  })
  if (!batch) throw new Error('Rubika batch not found')

  await db
    .update(rubikaIngestBatches)
    .set({ status: 'processing', updatedAt: new Date().toISOString() })
    .where(eq(rubikaIngestBatches.id, batchId))

  try {
    const images = await db.query.rubikaIngestImages.findMany({
      where: (i, { eq }) => eq(i.batchId, batchId),
      orderBy: [asc(rubikaIngestImages.sortOrder)],
    })

    const sourceUrls: string[] = []
    for (const image of images) {
      const url = image.sourceUrl ?? (image.fileId ? await getRubikaFileUrl(image.fileId) : null)
      if (!url) continue
      sourceUrls.push(url)
      if (!image.sourceUrl) {
        await db
          .update(rubikaIngestImages)
          .set({ sourceUrl: url })
          .where(eq(rubikaIngestImages.id, image.id))
      }
    }

    if (!sourceUrls.length) throw new Error('No usable images in Rubika batch')

    const storedUrls = await uploadRubikaImages(sourceUrls)

    for (let i = 0; i < storedUrls.length; i++) {
      const image = images[i]
      if (image) {
        await db
          .update(rubikaIngestImages)
          .set({ storedUrl: storedUrls[i] })
          .where(eq(rubikaIngestImages.id, image.id))
      }
    }

    const analysis = await analyzeCarpetImages(
      storedUrls.length ? storedUrls : sourceUrls,
      batch.caption ?? undefined,
    )

    const title = analysis.title || 'محصول جدید فرش'
    const [draft] = await db
      .insert(productDrafts)
      .values({
        batchId,
        title,
        slug: `${slugify(title) || 'carpet'}-${Date.now()}`,
        description: analysis.description,
        analysisJson: JSON.stringify(analysis),
        status: 'review',
        confidence: analysis.confidence,
      })
      .returning({ id: productDrafts.id })

    if (storedUrls.length) {
      await db.insert(productDraftImages).values(
        storedUrls.map((url, index) => ({
          draftId: draft.id,
          url,
          kind: 'source' as const,
          alt: title,
          sortOrder: index,
        })),
      )
    }

    if (process.env.RUBIKA_GENERATE_MARKETING_IMAGES === 'true' && storedUrls[0]) {
      const generated = await generateMarketingImages(storedUrls[0], title)
      if (generated.length) {
        await db.insert(productDraftImages).values(
          generated.map((image, index) => ({
            draftId: draft.id,
            url: image.url,
            kind: image.kind,
            alt: title,
            sortOrder: storedUrls.length + index,
          })),
        )
      }
    }

    await db
      .update(rubikaIngestBatches)
      .set({
        status: 'ready',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(rubikaIngestBatches.id, batchId))

    if (batch.chatId) {
      await sendRubikaMessage(
        batch.chatId,
        `✅ تحلیل فرش آماده شد.\\nمحصول پیشنهادی: ${title}\\nاطمینان AI: ${Math.round(analysis.confidence * 100)}٪\\nDraft #${draft.id}\\n\\nقبل از انتشار، اطلاعات را در داشبورد بررسی کنید.`,
      )
    }

    return { draftId: draft.id, analysis }
  } catch (error) {
    await db
      .update(rubikaIngestBatches)
      .set({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(rubikaIngestBatches.id, batchId))
    throw error
  }
}
