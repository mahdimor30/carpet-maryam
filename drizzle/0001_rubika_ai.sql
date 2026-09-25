CREATE TABLE `rubika_ingest_batches` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `chat_id` text NOT NULL,
  `caption` text,
  `status` text DEFAULT 'pending' NOT NULL,
  `error` text,
  `created_at` text DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `rubika_ingest_images` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `batch_id` integer NOT NULL,
  `message_id` text,
  `file_id` text NOT NULL,
  `source_url` text,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `stored_url` text,
  `created_at` text DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (`batch_id`) REFERENCES `rubika_ingest_batches`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_drafts` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `batch_id` integer,
  `status` text DEFAULT 'review' NOT NULL,
  `title` text NOT NULL,
  `slug` text NOT NULL,
  `description` text,
  `analysis_json` text NOT NULL,
  `source_caption` text,
  `confidence` real,
  `created_at` text DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` text DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (`batch_id`) REFERENCES `rubika_ingest_batches`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_drafts_slug_unique` ON `product_drafts` (`slug`);
--> statement-breakpoint
CREATE TABLE `product_draft_images` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `draft_id` integer NOT NULL,
  `url` text NOT NULL,
  `kind` text DEFAULT 'source' NOT NULL,
  `alt` text,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `created_at` text DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (`draft_id`) REFERENCES `product_drafts`(`id`) ON UPDATE no action ON DELETE cascade
);
