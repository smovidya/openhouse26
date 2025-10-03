CREATE TABLE `participants` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`given_name` text NOT NULL,
	`family_name` text NOT NULL,
	`ags` integer NOT NULL,
	`special_need` text NOT NULL,
	`resident_province` text NOT NULL,
	`attendee_type` text NOT NULL,
	`school` text,
	`questions` text,
	`emergency_contact_name` text,
	`emergency_contact_phone` text,
	`emergency_contact_relation` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `staffs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`student_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`major` text NOT NULL,
	`phone` text NOT NULL,
	`line_id` text NOT NULL,
	`requested_role` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `staffs_student_id_unique` ON `staffs` (`student_id`);--> statement-breakpoint
CREATE TABLE `workshop_registrations` (
	`id` text PRIMARY KEY NOT NULL,
	`participant_id` text NOT NULL,
	`time_slot_id` text NOT NULL,
	`registration_type` text NOT NULL,
	`is_participated` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`time_slot_id`) REFERENCES `workshop_time_slots`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workshop_time_slots` (
	`id` text PRIMARY KEY NOT NULL,
	`workshop_id` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`date` integer,
	FOREIGN KEY (`workshop_id`) REFERENCES `workshops`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workshops` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`host_department` text NOT NULL,
	`host_department_abbr` text NOT NULL,
	`description` text NOT NULL,
	`image` text NOT NULL,
	`capacity` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
