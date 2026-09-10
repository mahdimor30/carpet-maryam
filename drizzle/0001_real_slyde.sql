CREATE TABLE `factories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`phone` text,
	`whatsapp` text,
	`contact_name` text,
	`address` text,
	`city` text,
	`region` text,
	`notes` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `factories_slug_unique` ON `factories` (`slug`);--> statement-breakpoint
CREATE TABLE `factory_products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`factory_id` integer NOT NULL,
	`variant_id` integer NOT NULL,
	`can_weave` integer DEFAULT false NOT NULL,
	`weaving_days` integer,
	`notes` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`factory_id`) REFERENCES `factories`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `factory_inventory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`factory_product_id` integer NOT NULL,
	`quantity` integer DEFAULT 0 NOT NULL,
	`reserved_quantity` integer DEFAULT 0 NOT NULL,
	`checked_at` integer,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`factory_product_id`) REFERENCES `factory_products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `factory_inventory_factory_product_unique` ON `factory_inventory` (`factory_product_id`);--> statement-breakpoint
CREATE TABLE `factory_quotes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`factory_product_id` integer NOT NULL,
	`purchase_price` integer NOT NULL,
	`valid_from` integer NOT NULL,
	`valid_until` integer,
	`quoted_by_user_id` integer,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`factory_product_id`) REFERENCES `factory_products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quoted_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `order_item_sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_item_id` integer NOT NULL,
	`factory_id` integer NOT NULL,
	`status` text DEFAULT 'checking' NOT NULL,
	`purchase_price` integer,
	`quantity` integer DEFAULT 1 NOT NULL,
	`checked_at` integer,
	`reserved_at` integer,
	`expected_ready_at` integer,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`factory_id`) REFERENCES `factories`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`image` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "name", "slug", "image", "created_at") SELECT "id", "name", "slug", "image", "created_at" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_designs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`image` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_designs`("id", "name", "slug", "image", "created_at") SELECT "id", "name", "slug", "image", "created_at" FROM `designs`;--> statement-breakpoint
DROP TABLE `designs`;--> statement-breakpoint
ALTER TABLE `__new_designs` RENAME TO `designs`;--> statement-breakpoint
CREATE UNIQUE INDEX `designs_slug_unique` ON `designs` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`message` text NOT NULL,
	`product_id` integer,
	`variant_id` integer,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_inquiries`("id", "user_id", "message", "product_id", "variant_id", "status", "created_at", "updated_at") SELECT "id", "user_id", "message", "product_id", "variant_id", "status", "created_at", "updated_at" FROM `inquiries`;--> statement-breakpoint
DROP TABLE `inquiries`;--> statement-breakpoint
ALTER TABLE `__new_inquiries` RENAME TO `inquiries`;--> statement-breakpoint
CREATE TABLE `__new_materials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`image` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_materials`("id", "name", "slug", "image", "created_at") SELECT "id", "name", "slug", "image", "created_at" FROM `materials`;--> statement-breakpoint
DROP TABLE `materials`;--> statement-breakpoint
ALTER TABLE `__new_materials` RENAME TO `materials`;--> statement-breakpoint
CREATE UNIQUE INDEX `materials_slug_unique` ON `materials` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`variant_id` integer NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`unit_price` integer NOT NULL,
	`total_price` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_order_items`("id", "order_id", "variant_id", "quantity", "unit_price", "total_price", "created_at") SELECT "id", "order_id", "variant_id", "quantity", "unit_price", "total_price", "created_at" FROM `order_items`;--> statement-breakpoint
DROP TABLE `order_items`;--> statement-breakpoint
ALTER TABLE `__new_order_items` RENAME TO `order_items`;--> statement-breakpoint
CREATE TABLE `__new_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`shipping_address` text NOT NULL,
	`customer_note` text,
	`total_amount` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_orders`("id", "user_id", "shipping_address", "customer_note", "total_amount", "status", "created_at", "updated_at") SELECT "id", "user_id", "shipping_address", "customer_note", "total_amount", "status", "created_at", "updated_at" FROM `orders`;--> statement-breakpoint
DROP TABLE `orders`;--> statement-breakpoint
ALTER TABLE `__new_orders` RENAME TO `orders`;--> statement-breakpoint
CREATE TABLE `__new_product_variants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`dimension` text NOT NULL,
	`color` text NOT NULL,
	`color_hex` text,
	`sku` text NOT NULL,
	`price` integer NOT NULL,
	`compare_at_price` integer,
	`stock` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_product_variants`("id", "product_id", "dimension", "color", "color_hex", "sku", "price", "compare_at_price", "stock", "is_active", "created_at", "updated_at") SELECT "id", "product_id", "dimension", "color", "color_hex", "sku", "price", "compare_at_price", "stock", "is_active", "created_at", "updated_at" FROM `product_variants`;--> statement-breakpoint
DROP TABLE `product_variants`;--> statement-breakpoint
ALTER TABLE `__new_product_variants` RENAME TO `product_variants`;--> statement-breakpoint
CREATE UNIQUE INDEX `product_variants_sku_unique` ON `product_variants` (`sku`);--> statement-breakpoint
CREATE TABLE `__new_products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`description_short` text,
	`brand` text,
	`style` text,
	`shaneh` integer,
	`density` integer,
	`yarn` text,
	`pile_height_mm` integer,
	`weight_per_square_meter_grams` integer,
	`weaving_type` text,
	`warranty_months` integer,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "name", "slug", "description", "description_short", "brand", "style", "shaneh", "density", "yarn", "pile_height_mm", "weight_per_square_meter_grams", "weaving_type", "warranty_months", "is_active", "created_at", "updated_at") SELECT "id", "name", "slug", "description", "description_short", "brand", "style", "shaneh", "density", "yarn", "pile_height_mm", "weight_per_square_meter_grams", "weaving_type", "warranty_months", "is_active", "created_at", "updated_at" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token` text NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "user_id", "token", "user_agent", "ip_address", "expires_at", "created_at") SELECT "id", "user_id", "token", "user_agent", "ip_address", "expires_at", "created_at" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`name` text,
	`role` text DEFAULT 'customer' NOT NULL,
	`password_hash` text,
	`otp_code` text,
	`otp_expires_at` integer,
	`otp_attempts` integer DEFAULT 0 NOT NULL,
	`phone_verified_at` integer,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "phone", "email", "name", "role", "password_hash", "otp_code", "otp_expires_at", "otp_attempts", "phone_verified_at", "is_active", "created_at", "updated_at") SELECT "id", "phone", "email", "name", "role", "password_hash", "otp_code", "otp_expires_at", "otp_attempts", "phone_verified_at", "is_active", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_phone_unique` ON `users` (`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `__new_variant_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`variant_id` integer NOT NULL,
	`url` text NOT NULL,
	`key` text,
	`alt` text,
	`type` text DEFAULT 'gallery' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_variant_images`("id", "variant_id", "url", "key", "alt", "type", "sort_order", "is_primary", "created_at") SELECT "id", "variant_id", "url", "key", "alt", "type", "sort_order", "is_primary", "created_at" FROM `variant_images`;--> statement-breakpoint
DROP TABLE `variant_images`;--> statement-breakpoint
ALTER TABLE `__new_variant_images` RENAME TO `variant_images`;