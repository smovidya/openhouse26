DROP TABLE `checkpoints`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_checkins` (
	`id` text PRIMARY KEY NOT NULL,
	`participant_id` text,
	`checked_by_staff_id` text,
	`checkpoint_id` text,
	`data` text DEFAULT '{}',
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`ticket_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`checked_by_staff_id`) REFERENCES `staffs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_checkins`("id", "participant_id", "checked_by_staff_id", "checkpoint_id", "data", "created_at", "updated_at", "deleted_at") SELECT "id", "participant_id", "checked_by_staff_id", "checkpoint_id", "data", "created_at", "updated_at", "deleted_at" FROM `checkins`;--> statement-breakpoint
DROP TABLE `checkins`;--> statement-breakpoint
ALTER TABLE `__new_checkins` RENAME TO `checkins`;--> statement-breakpoint
PRAGMA foreign_keys=ON;