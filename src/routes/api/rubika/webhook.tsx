import { createFileRoute } from '@tanstack/react-router'
import { and, desc, eq } from 'drizzle-orm'
import { getDb } from '@/server/db'
import { rubikaIngestBatches, rubikaIngestImages } from '@/server/db/schema'
import {
  extractRubikaMessage,
  isAnalyzeCommand,
} from '@/feature/rubika-ai/server/extract-update'
import { sendRubikaMessage } from '@/feature/rubika-ai/server/rubika-client'
import { processRubikaBatch } from '@/feature/rubika-ai/server/process-batch'

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

export const Route = createFileRoute('/api/rubika/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.RUBIKA_WEBHOOK_SECRET
        const url = new URL(request.url)

        if (!secret) {
          return json({ error: 'webhook is not configured' }, 503)
        }

        if (url.searchParams.get('secret') !== secret) {
          return json({ error: 'unauthorized' }, 401)
        }

        const update = (await request.json()) as Record<string, unknown>
        const { text, fileId, chatId, messageId } = extractRubikaMessage(update)

        if (!chatId) return json({ ok: true, ignored: 'no-chat-id' })

        const allowedChatId = process.env.RUBIKA_CHANNEL_ID
        if (!allowedChatId) {
          return json({ error: 'channel is not configured' }, 503)
        }

        if (chatId !== allowedChatId) {
          return json({ ok: true, ignored: 'chat-not-allowed' })
        }

        const db = getDb()

        if (isAnalyzeCommand(text)) {
          const latest = await db.query.rubikaIngestBatches.findFirst({
            where: and(
              eq(rubikaIngestBatches.chatId, chatId),
              eq(rubikaIngestBatches.status, 'pending'),
            ),
            orderBy: [desc(rubikaIngestBatches.createdAt)],
          })

          if (!latest) {
            await sendRubikaMessage(chatId, 'عکسی برای تحلیل پیدا نشد.')
            return json({ ok: true, action: 'no-batch' })
          }

          await processRubikaBatch(latest.id)
          return json({ ok: true, action: 'processed', batchId: latest.id })
        }

        if (!fileId) return json({ ok: true, ignored: 'not-image' })

        const batch = await db.query.rubikaIngestBatches.findFirst({
          where: and(
            eq(rubikaIngestBatches.chatId, chatId),
            eq(rubikaIngestBatches.status, 'pending'),
          ),
          orderBy: [desc(rubikaIngestBatches.createdAt)],
        })

        const batchAge = batch
          ? Date.now() - new Date(batch.createdAt ?? Date.now()).getTime()
          : Number.POSITIVE_INFINITY

        let batchId = batch?.id
        if (!batch || batchAge > 10 * 60 * 1000) {
          const [created] = await db
            .insert(rubikaIngestBatches)
            .values({
              chatId,
              caption: text || null,
              status: 'pending',
            })
            .returning({ id: rubikaIngestBatches.id })
          if (!created) return json({ error: 'failed to create batch' }, 500)
          batchId = created.id
        } else if (text) {
          await db
            .update(rubikaIngestBatches)
            .set({ caption: text, updatedAt: new Date().toISOString() })
            .where(eq(rubikaIngestBatches.id, batchId!))
        }

        if (!batchId) return json({ error: 'failed to resolve batch' }, 500)

        const sourceUrl = null

        await db.insert(rubikaIngestImages).values({
          batchId,
          messageId,
          fileId,
          sourceUrl,
          sortOrder: Date.now(),
        })

        const imageCount = await db.query.rubikaIngestImages.findMany({
          where: (i, { eq }) => eq(i.batchId, batchId),
          columns: { id: true },
        })

        const autoCount = Number(process.env.RUBIKA_AUTO_ANALYZE_AFTER || 0)
        if (autoCount > 0 && imageCount.length >= autoCount) {
          await processRubikaBatch(batchId)
        }

        return json({
          ok: true,
          action: 'queued',
          batchId,
          imageCount: imageCount.length,
        })
      },
    },
  },
})
