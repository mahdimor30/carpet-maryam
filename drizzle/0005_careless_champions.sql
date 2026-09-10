PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_order_item_sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_item_id` integer NOT NULL,
	`source_type` text NOT NULL,
	`factory_id` integer,
	`factory_product_id` integer,
	`purchase_price` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`factory_id`) REFERENCES `factories`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`factory_product_id`) REFERENCES `factory_products`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_order_item_sources`("id", "order_item_id", "source_type", "factory_id", "factory_product_id", "purchase_price", "created_at") SELECT "id", "order_item_id", "source_type", "factory_id", "factory_product_id", "purchase_price", "created_at" FROM `order_item_sources`;--> statement-breakpoint
DROP TABLE `order_item_sources`;--> statement-breakpoint
ALTER TABLE `__new_order_item_sources` RENAME TO `order_item_sources`;--> statement-breakpoint
PRAGMA foreign_keys=ON;