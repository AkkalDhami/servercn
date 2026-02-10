CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`provider` enum('local','google','github') NOT NULL DEFAULT 'local',
	`provider_id` varchar(255),
	`avatar` json,
	`is_email_verified` boolean NOT NULL DEFAULT false,
	`last_login_at` timestamp,
	`failed_login_attempts` int NOT NULL DEFAULT 0,
	`lock_until` timestamp,
	`is_deleted` boolean NOT NULL DEFAULT false,
	`deleted_at` timestamp,
	`re_activate_available_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `refresh_tokens` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` timestamp NOT NULL,
	`is_revoked` boolean NOT NULL DEFAULT false,
	`revoked_at` timestamp,
	`replaced_by_token_hash` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `refresh_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `role_idx` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `is_deleted_idx` ON `users` (`is_deleted`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `refresh_tokens` (`user_id`);--> statement-breakpoint
CREATE INDEX `token_hash_idx` ON `refresh_tokens` (`token_hash`);--> statement-breakpoint
CREATE INDEX `is_revoked_idx` ON `refresh_tokens` (`is_revoked`);--> statement-breakpoint
CREATE INDEX `expires_at_idx` ON `refresh_tokens` (`expires_at`);