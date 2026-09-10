CREATE UNIQUE INDEX `carts_user_unique` ON `carts` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `carts_session_unique` ON `carts` (`session_id`);