CREATE TABLE `checkins` (
	`id` text PRIMARY KEY NOT NULL,
	`participant_id` text,
	`checked_by_staff_id` text,
	`checkpoint_id` text,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`checked_by_staff_id`) REFERENCES `staffs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`checkpoint_id`) REFERENCES `checkpoints`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `checkpoints` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`note` text,
	`type` text,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `redeem_rewards` (
	`id` text PRIMARY KEY NOT NULL,
	`participant_id` text,
	`redeemed_by_staff_id` text,
	`reward_data` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`redeemed_by_staff_id`) REFERENCES `staffs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workshop_registrations` (
	`id` text PRIMARY KEY NOT NULL,
	`participant_id` text NOT NULL,
	`time_slot_id` text NOT NULL,
	`registration_type` text NOT NULL,
	`participated_at` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`time_slot_id`) REFERENCES `workshop_time_slots`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workshop_registrations`("id", "participant_id", "time_slot_id", "registration_type", "participated_at", "created_at", "updated_at") SELECT "id", "participant_id", "time_slot_id", "registration_type", "participated_at", "created_at", "updated_at" FROM `workshop_registrations`;--> statement-breakpoint
DROP TABLE `workshop_registrations`;--> statement-breakpoint
ALTER TABLE `__new_workshop_registrations` RENAME TO `workshop_registrations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `participants` ADD `qr_code_id` text;--> statement-breakpoint
CREATE INDEX `qr_code_id_idx` ON `participants` (`qr_code_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `participants` (`user_id`);