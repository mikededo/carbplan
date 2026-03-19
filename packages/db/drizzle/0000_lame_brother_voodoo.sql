CREATE TYPE "public"."sex" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."product_form" AS ENUM('gel', 'bar', 'chew', 'drink_mix', 'powder', 'capsule', 'liquid', 'solid');--> statement-breakpoint
CREATE TYPE "public"."workout_source" AS ENUM('manual', 'intervals_icu');--> statement-breakpoint
CREATE TABLE "athletes" (
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"ftp" integer,
	"full_name" text,
	"height_cm" numeric(5, 1),
	"hr_max" integer,
	"hr_rest" integer,
	"hr_zones" jsonb,
	"id" uuid PRIMARY KEY NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"max_carb_intake_g_per_hr" integer,
	"power_zones" jsonb,
	"sex" "sex",
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"weight_kg" numeric(5, 2)
);
--> statement-breakpoint
CREATE TABLE "coaching_relationships" (
	"accepted_at" timestamp with time zone,
	"athlete_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "coaching_relationships_not_self" CHECK ("coaching_relationships"."coach_id" <> "coaching_relationships"."athlete_id")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"access_token" text,
	"access_token_expires_at" timestamp with time zone,
	"account_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_token" text,
	"password" text,
	"provider_id" text NOT NULL,
	"refresh_token" text,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip_address" text,
	"token" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_agent" text,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"email_verified" timestamp with time zone,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image" text,
	"name" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"logo_url" text,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"website" text
);
--> statement-breakpoint
CREATE TABLE "favorite_brands" (
	"athlete_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "favorite_brands_athlete_id_brand_id_pk" PRIMARY KEY("athlete_id","brand_id")
);
--> statement-breakpoint
CREATE TABLE "favorite_products" (
	"athlete_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"product_id" uuid NOT NULL,
	CONSTRAINT "favorite_products_athlete_id_product_id_pk" PRIMARY KEY("athlete_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"brand_id" uuid NOT NULL,
	"caffeine_mg" integer,
	"calories" integer,
	"carbs_g" numeric(5, 1),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"fat_g" numeric(5, 1),
	"flavor" text,
	"form" "product_form" NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"name" text NOT NULL,
	"notes" text,
	"protein_g" numeric(5, 1),
	"serving_size" numeric(6, 2) NOT NULL,
	"servings_per_package" integer,
	"serving_unit" text DEFAULT 'g' NOT NULL,
	"slug" text NOT NULL,
	"sodium_mg" integer,
	"sugar_g" numeric(5, 1),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nutrition_plans" (
	"athlete_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"date" date NOT NULL,
	"duration_minutes" integer NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"name" text NOT NULL,
	"notes" text,
	"target_carbs_per_hour" integer,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"workout_id" uuid,
	"workout_snapshot" jsonb
);
--> statement-breakpoint
CREATE TABLE "plan_groups" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"end_offset_minutes" integer,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"notes" text,
	"plan_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"start_offset_minutes" integer DEFAULT 0 NOT NULL,
	"target_caffeine_mg_per_hr" integer,
	"target_carbs_g_per_hr" integer,
	"target_sodium_mg_per_hr" integer,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_items" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"group_id" uuid,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notes" text,
	"plan_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"servings" numeric(4, 2) DEFAULT 1 NOT NULL,
	"timing_minutes" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"athlete_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"end_date_local" timestamp with time zone,
	"external_id" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"joules" bigint,
	"moving_time_seconds" integer,
	"name" text NOT NULL,
	"parsed_doc" jsonb,
	"raw_payload" jsonb,
	"raw_text" text,
	"source" "workout_source" DEFAULT 'manual' NOT NULL,
	"start_date_local" timestamp with time zone,
	"tss" numeric(7, 2),
	"type" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coaching_relationships" ADD CONSTRAINT "coaching_relationships_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coaching_relationships" ADD CONSTRAINT "coaching_relationships_coach_id_athletes_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_brands" ADD CONSTRAINT "favorite_brands_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_brands" ADD CONSTRAINT "favorite_brands_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_products" ADD CONSTRAINT "favorite_products_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_products" ADD CONSTRAINT "favorite_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_plans" ADD CONSTRAINT "nutrition_plans_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_plans" ADD CONSTRAINT "nutrition_plans_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_groups" ADD CONSTRAINT "plan_groups_plan_id_nutrition_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."nutrition_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_items" ADD CONSTRAINT "plan_items_group_id_plan_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."plan_groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_items" ADD CONSTRAINT "plan_items_plan_id_nutrition_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."nutrition_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_items" ADD CONSTRAINT "plan_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "athletes_email_idx" ON "athletes" USING btree ("email");--> statement-breakpoint
CREATE INDEX "athletes_is_admin_idx" ON "athletes" USING btree ("is_admin");--> statement-breakpoint
CREATE UNIQUE INDEX "coaching_relationships_coach_athlete_unique" ON "coaching_relationships" USING btree ("coach_id","athlete_id");--> statement-breakpoint
CREATE INDEX "coaching_relationships_coach_idx" ON "coaching_relationships" USING btree ("coach_id");--> statement-breakpoint
CREATE INDEX "coaching_relationships_athlete_idx" ON "coaching_relationships" USING btree ("athlete_id");--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_account_unique" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "session_token_unique" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_expires_at_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_unique" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "verification_identifier_value_unique" ON "verification" USING btree ("identifier","value");--> statement-breakpoint
CREATE INDEX "verification_expires_at_idx" ON "verification" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "brands_name_unique" ON "brands" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "brands_slug_unique" ON "brands" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "brands_is_active_idx" ON "brands" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "favorite_brands_athlete_idx" ON "favorite_brands" USING btree ("athlete_id");--> statement-breakpoint
CREATE INDEX "favorite_brands_brand_idx" ON "favorite_brands" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "favorite_products_athlete_idx" ON "favorite_products" USING btree ("athlete_id");--> statement-breakpoint
CREATE INDEX "favorite_products_product_idx" ON "favorite_products" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "products_brand_slug_unique" ON "products" USING btree ("brand_id","slug");--> statement-breakpoint
CREATE INDEX "products_brand_id_idx" ON "products" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "products_slug_idx" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_form_idx" ON "products" USING btree ("form");--> statement-breakpoint
CREATE INDEX "products_is_active_idx" ON "products" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "products_caffeine_idx" ON "products" USING btree ("caffeine_mg") WHERE "products"."caffeine_mg" is not null;--> statement-breakpoint
CREATE INDEX "nutrition_plans_athlete_idx" ON "nutrition_plans" USING btree ("athlete_id");--> statement-breakpoint
CREATE INDEX "nutrition_plans_date_idx" ON "nutrition_plans" USING btree ("date");--> statement-breakpoint
CREATE INDEX "nutrition_plans_is_active_idx" ON "nutrition_plans" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "nutrition_plans_workout_idx" ON "nutrition_plans" USING btree ("workout_id");--> statement-breakpoint
CREATE INDEX "plan_groups_plan_idx" ON "plan_groups" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "plan_groups_sort_idx" ON "plan_groups" USING btree ("plan_id","sort_order");--> statement-breakpoint
CREATE INDEX "plan_items_plan_idx" ON "plan_items" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "plan_items_product_idx" ON "plan_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "plan_items_timing_idx" ON "plan_items" USING btree ("timing_minutes");--> statement-breakpoint
CREATE INDEX "plan_items_group_idx" ON "plan_items" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "workouts_athlete_idx" ON "workouts" USING btree ("athlete_id");--> statement-breakpoint
CREATE INDEX "workouts_start_date_idx" ON "workouts" USING btree ("start_date_local");--> statement-breakpoint
CREATE UNIQUE INDEX "workouts_source_external_idx" ON "workouts" USING btree ("athlete_id","source","external_id");