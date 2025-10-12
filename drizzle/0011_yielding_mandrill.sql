PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_staffs` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`major` text NOT NULL,
	`phone` text NOT NULL,
	`requested_role` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_staffs`("id", "student_id", "name", "email", "major", "phone", "requested_role", "created_at", "updated_at") SELECT "id", "student_id", "name", "email", "major", "phone", "requested_role", "created_at", "updated_at" FROM `staffs`;--> statement-breakpoint
DROP TABLE `staffs`;--> statement-breakpoint
ALTER TABLE `__new_staffs` RENAME TO `staffs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;