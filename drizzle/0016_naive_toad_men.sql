CREATE TABLE `redeemed_rewards` (
	`id` text PRIMARY KEY NOT NULL,
	`participant_id` text,
	`staff_id` text,
	`reward_data` text,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`staff_id`) REFERENCES `staffs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `surveys` (
	`id` text PRIMARY KEY NOT NULL,
	`participant_id` text NOT NULL,
	`responses` text NOT NULL,
	`cert_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `surveys_cert_id_unique` ON `surveys` (`cert_id`);