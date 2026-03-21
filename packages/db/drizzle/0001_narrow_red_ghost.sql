ALTER TABLE "user"
  ALTER COLUMN "email_verified" TYPE boolean
  USING CASE WHEN email_verified IS NULL THEN false ELSE true END;
--> statement-breakpoint
ALTER TABLE "user"
  ALTER COLUMN "email_verified" SET DEFAULT false,
  ALTER COLUMN "email_verified" SET NOT NULL;
