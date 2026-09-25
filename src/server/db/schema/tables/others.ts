/* ============================================================
 * 7. Rubika -> AI product ingestion
 * ============================================================ */

import { relations, sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const rubikaIngestBatches = sqliteTable('rubika_ingest_batches', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  chatId: text('chat_id').notNull(),
  caption: text('caption'),
  status: text('status', {
    enum: ['pending', 'processing', 'ready', 'failed'],
  })
    .notNull()
    .default('pending'),
  error: text('error'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
})

export const rubikaIngestImages = sqliteTable('rubika_ingest_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  batchId: integer('batch_id')
    .notNull()
    .references(() => rubikaIngestBatches.id, { onDelete: 'cascade' }),
  messageId: text('message_id'),
  fileId: text('file_id').notNull(),
  sourceUrl: text('source_url'),
  sortOrder: integer('sort_order').notNull().default(0),
  storedUrl: text('stored_url'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
})

export const productDrafts = sqliteTable('product_drafts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  batchId: integer('batch_id').references(() => rubikaIngestBatches.id, {
    onDelete: 'set null',
  }),
  status: text('status', {
    enum: ['review', 'approved', 'rejected', 'published'],
  })
    .notNull()
    .default('review'),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  analysisJson: text('analysis_json').notNull(),
  sourceCaption: text('source_caption'),
  confidence: real('confidence'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
})

export const productDraftImages = sqliteTable('product_draft_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  draftId: integer('draft_id')
    .notNull()
    .references(() => productDrafts.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  kind: text('kind', {
    enum: ['source', 'product', 'interior', 'advertisement'],
  })
    .notNull()
    .default('source'),
  alt: text('alt'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
})

export const rubikaIngestBatchesRelations = relations(
  rubikaIngestBatches,
  ({ many }) => ({
    images: many(rubikaIngestImages),
    drafts: many(productDrafts),
  }),
)

export const rubikaIngestImagesRelations = relations(
  rubikaIngestImages,
  ({ one }) => ({
    batch: one(rubikaIngestBatches, {
      fields: [rubikaIngestImages.batchId],
      references: [rubikaIngestBatches.id],
    }),
  }),
)

export const productDraftsRelations = relations(
  productDrafts,
  ({ one, many }) => ({
    batch: one(rubikaIngestBatches, {
      fields: [productDrafts.batchId],
      references: [rubikaIngestBatches.id],
    }),
    images: many(productDraftImages),
  }),
)

export const productDraftImagesRelations = relations(
  productDraftImages,
  ({ one }) => ({
    draft: one(productDrafts, {
      fields: [productDraftImages.draftId],
      references: [productDrafts.id],
    }),
  }),
)
