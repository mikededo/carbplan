ALTER TABLE "plan_groups" DROP CONSTRAINT IF EXISTS "plan_groups_plan_id_nutrition_plans_id_fk";
--> statement-breakpoint
ALTER TABLE "plan_groups" DROP CONSTRAINT IF EXISTS "plan_groups_plan_id_fkey";
--> statement-breakpoint
ALTER TABLE "plan_items" DROP CONSTRAINT IF EXISTS "plan_items_plan_id_nutrition_plans_id_fk";
--> statement-breakpoint
ALTER TABLE "plan_items" DROP CONSTRAINT IF EXISTS "plan_items_plan_id_fkey";
--> statement-breakpoint
ALTER TABLE "plan_groups" ADD CONSTRAINT "plan_groups_plan_id_nutrition_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."nutrition_plans"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "plan_items" ADD CONSTRAINT "plan_items_plan_id_nutrition_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."nutrition_plans"("id") ON DELETE cascade ON UPDATE cascade;
