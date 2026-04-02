CREATE TABLE `competitors` (
	`id` text PRIMARY KEY NOT NULL,
	`team_id` text,
	`email` text,
	`phone` text,
	`names` text,
	`tier` text,
	`online_round_score` integer,
	`created_at` integer,
	`updated_at` integer
);
