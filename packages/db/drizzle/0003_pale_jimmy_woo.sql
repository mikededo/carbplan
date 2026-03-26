DROP INDEX "athletes_is_admin_idx";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "athletes" DROP COLUMN "is_admin";