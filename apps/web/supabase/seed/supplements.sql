-- Seed data for supplement catalog
-- 
-- Nutritional data sourced from:
-- - Open Food Facts (https://world.openfoodfacts.org) - Open database licensed under ODbL
-- - Manufacturer websites and product labels
--
-- Credit: Open Food Facts contributors (https://world.openfoodfacts.org/credits)
--
-- Popular cycling/endurance nutrition brands and products

-- Insert brands
insert into public.brands (name, slug, website, description) values
  ('SiS (Science in Sport)', 'sis', 'https://www.scienceinsport.com', 'British sports nutrition company, official supplier to many pro cycling teams'),
  ('Maurten', 'maurten', 'https://www.maurten.com', 'Swedish brand known for hydrogel technology, used by elite marathoners and cyclists'),
  ('GU Energy', 'gu-energy', 'https://guenergy.com', 'American pioneer in energy gels, widely used in endurance sports'),
  ('Clif Bar', 'clif-bar', 'https://www.clifbar.com', 'Organic energy bars and nutrition products for athletes'),
  ('High5', 'high5', 'https://highfive.co.uk', 'British sports nutrition brand focused on energy and hydration'),
  ('Precision Fuel & Hydration', 'precision-hydration', 'https://www.precisionhydration.com', 'Specializes in personalized hydration solutions for endurance athletes'),
  ('Skratch Labs', 'skratch-labs', 'https://www.skratchlabs.com', 'American brand focused on real food ingredients and hydration'),
  ('Torq', 'torq', 'https://torqfitness.co.uk', 'British brand with focus on natural ingredients and performance'),
  ('Enervit', 'enervit', 'https://www.enervit.com', 'Italian sports nutrition company with long history in cycling'),
  ('Powerbar', 'powerbar', 'https://www.powerbar.com', 'One of the original sports nutrition brands, now part of Post Holdings'),
  ('Hammer Nutrition', 'hammer-nutrition', 'https://www.hammernutrition.com', 'American brand focused on endurance athletes with no simple sugars'),
  ('Tailwind Nutrition', 'tailwind-nutrition', 'https://www.tailwindnutrition.com', 'All-in-one endurance fuel that mixes clear and is easy on the stomach'),
  ('Neversecond', 'neversecond', 'https://neversecond.com', 'New brand focused on high-carb fueling for endurance athletes'),
  ('Näak', 'naak', 'https://naakbar.com', 'Canadian brand using cricket protein and sustainable ingredients'),
  ('Veloforte', 'veloforte', 'https://veloforte.com', 'British brand using natural, real food ingredients'),
  ('Sponser', 'sponser', 'https://www.sponser.com', 'Swiss sports nutrition brand, official supplier to many pro cycling teams'),
  ('MNSTYR', 'mnstyr', 'https://mnstyr.com', 'Modern sports nutrition brand focused on clean, effective fueling'),
  ('Nduranz', 'nduranz', 'https://nduranz.com', 'Slovenian brand focused on science-based endurance nutrition'),
  ('Styrkr', 'styrkr', 'https://styrkr.com', 'British brand with focus on natural ingredients and taste'),
  ('Nutrition X', 'nutrition-x', 'https://nutritionx.co.uk', 'British sports nutrition brand with wide product range'),
  ('OTE Sports', 'ote-sports', 'https://www.otesports.co.uk', 'British brand focused on natural, effective sports nutrition'),
  ('Etixx', 'etixx', 'https://www.etixx.com', 'Belgian sports nutrition brand with pro cycling heritage'),
  ('Isostar', 'isostar', 'https://www.isostar.com', 'Swiss brand with long history in sports hydration'),
  ('Aptonia', 'aptonia', 'https://www.decathlon.com', 'Decathlon sports nutrition brand, affordable and accessible'),
  ('Mulebar', 'mulebar', 'https://www.mulebar.com', 'British brand known for natural energy bars and gels'),
  ('Huma Gel', 'huma-gel', 'https://humagel.com', 'Chia-based energy gels inspired by the Tarahumara runners'),
  ('Spring Energy', 'spring-energy', 'https://springenergy.com', 'Real food energy gels made with natural ingredients'),
  ('UnTapped', 'untapped', 'https://untapped.cc', 'Vermont-based brand using pure maple syrup for energy'),
  ('Beta Red', 'beta-red', 'https://betared.com', 'Beetroot-based performance nutrition'),
  ('Honey Stinger', 'honey-stinger', 'https://honeystinger.com', 'Organic honey-based energy products')
on conflict (slug) do nothing;

-- SiS Products (expanded)
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('GO Isotonic Energy Gel', 'go-isotonic-gel', 'gel', 'Orange', 60, 'ml', 87, 22, 1, 0, 0, 10, null, 'Isotonic formula - no water needed'),
  ('GO Isotonic Energy Gel', 'go-isotonic-gel-apple', 'gel', 'Apple', 60, 'ml', 87, 22, 1, 0, 0, 10, null, 'Isotonic formula - no water needed'),
  ('GO Isotonic Energy Gel', 'go-isotonic-gel-lemon-lime', 'gel', 'Lemon & Lime', 60, 'ml', 87, 22, 1, 0, 0, 10, null, 'Isotonic formula - no water needed'),
  ('GO Isotonic Energy Gel', 'go-isotonic-gel-tropical', 'gel', 'Tropical', 60, 'ml', 87, 22, 1, 0, 0, 10, null, 'Isotonic formula - no water needed'),
  ('GO Isotonic Energy Gel + Caffeine', 'go-isotonic-gel-caffeine-berry', 'gel', 'Berry', 60, 'ml', 87, 22, 1, 0, 0, 10, 75, 'With 75mg caffeine'),
  ('GO Isotonic Energy Gel + Caffeine', 'go-isotonic-gel-caffeine-cola', 'gel', 'Cola', 60, 'ml', 87, 22, 1, 0, 0, 10, 75, 'With 75mg caffeine'),
  ('GO Isotonic Energy Gel + Caffeine', 'go-isotonic-gel-caffeine-citrus', 'gel', 'Citrus', 60, 'ml', 87, 22, 1, 0, 0, 10, 150, 'With 150mg caffeine - double shot'),
  ('GO Energy + Electrolyte Gel', 'go-energy-electrolyte-gel', 'gel', 'Salted Strawberry', 60, 'ml', 87, 22, 1, 0, 0, 118, null, 'Added electrolytes for hot conditions'),
  ('GO Energy + Electrolyte Gel', 'go-energy-electrolyte-gel-lemon', 'gel', 'Lemon & Mint', 60, 'ml', 87, 22, 1, 0, 0, 118, null, 'Added electrolytes for hot conditions'),
  ('Beta Fuel Gel', 'beta-fuel-gel-orange', 'gel', 'Orange', 60, 'ml', 164, 40, 8, 0, 0, 35, null, '40g carbs with 1:0.8 glucose:fructose ratio'),
  ('Beta Fuel Gel', 'beta-fuel-gel-strawberry-lime', 'gel', 'Strawberry & Lime', 60, 'ml', 164, 40, 8, 0, 0, 35, null, '40g carbs with 1:0.8 glucose:fructose ratio'),
  ('Beta Fuel Gel + Nootropics', 'beta-fuel-gel-nootropics', 'gel', 'Orange', 60, 'ml', 164, 40, 8, 0, 0, 35, 200, 'With caffeine and nootropics'),
  ('GO Energy Bar', 'go-energy-bar-chocolate', 'bar', 'Chocolate Fudge', 40, 'g', 148, 26, 12, 4, 3, 25, null, 'Easy to digest energy bar'),
  ('GO Energy Bar', 'go-energy-bar-blueberry', 'bar', 'Blueberry', 40, 'g', 148, 26, 12, 4, 3, 25, null, 'Easy to digest energy bar'),
  ('GO Energy Bar', 'go-energy-bar-red-berry', 'bar', 'Red Berry', 40, 'g', 148, 26, 12, 4, 3, 25, null, 'Easy to digest energy bar'),
  ('GO Energy Bake', 'go-energy-bake-banana', 'solid', 'Banana', 50, 'g', 201, 30, 17, 4, 7, 35, null, 'Filled energy bar'),
  ('GO Energy Bake', 'go-energy-bake-orange', 'solid', 'Orange', 50, 'g', 201, 30, 17, 4, 7, 35, null, 'Filled energy bar'),
  ('GO Hydro Tablet', 'go-hydro-tablet-lemon', 'chew', 'Lemon', 4.2, 'g', 8, 1, 0, 0, 0, 250, null, 'Zero calorie electrolyte tablet'),
  ('GO Hydro Tablet', 'go-hydro-tablet-berry', 'chew', 'Berry', 4.2, 'g', 8, 1, 0, 0, 0, 250, null, 'Zero calorie electrolyte tablet'),
  ('GO Hydro Tablet', 'go-hydro-tablet-pineapple', 'chew', 'Pineapple & Mango', 4.2, 'g', 8, 1, 0, 0, 0, 250, null, 'Zero calorie electrolyte tablet'),
  ('GO Electrolyte Powder', 'go-electrolyte-powder-lemon', 'drink_mix', 'Lemon & Lime', 40, 'g', 144, 36, 6, 0, 0, 250, null, 'Energy + electrolytes drink mix'),
  ('GO Electrolyte Powder', 'go-electrolyte-powder-orange', 'drink_mix', 'Orange', 40, 'g', 144, 36, 6, 0, 0, 250, null, 'Energy + electrolytes drink mix'),
  ('Beta Fuel Drink Mix', 'beta-fuel-drink-orange', 'drink_mix', 'Orange', 84, 'g', 324, 80, 15, 0, 0, 250, null, '80g carbs per serving'),
  ('REGO Rapid Recovery', 'rego-recovery-chocolate', 'powder', 'Chocolate', 50, 'g', 185, 23, 5, 20, 1, 150, null, 'Post-workout recovery shake')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'sis'
on conflict (brand_id, slug) do nothing;

-- Maurten Products (expanded)
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Gel 100', 'gel-100', 'gel', 'Unflavored', 40, 'g', 100, 25, 12.5, 0, 0, 35, null, 'Hydrogel technology for easy absorption'),
  ('Gel 100 Caf 100', 'gel-100-caf-100', 'gel', 'Unflavored', 40, 'g', 100, 25, 12.5, 0, 0, 35, 100, 'With 100mg caffeine'),
  ('Gel 160', 'gel-160', 'gel', 'Unflavored', 65, 'g', 160, 40, 20, 0, 0, 55, null, 'Higher carb version for intense efforts'),
  ('Drink Mix 160', 'drink-mix-160', 'drink_mix', 'Unflavored', 40, 'g', 160, 40, 20, 0, 0, 80, null, 'Hydrogel drink mix'),
  ('Drink Mix 320', 'drink-mix-320', 'drink_mix', 'Unflavored', 80, 'g', 320, 80, 40, 0, 0, 160, null, 'High carb hydrogel drink mix'),
  ('Drink Mix 320 Caf 100', 'drink-mix-320-caf-100', 'drink_mix', 'Unflavored', 80, 'g', 320, 80, 40, 0, 0, 160, 100, 'High carb with caffeine'),
  ('Solid 225', 'solid-225', 'solid', 'Unflavored', 60, 'g', 225, 56, 28, 0, 0, 90, null, 'Solid fuel bar with hydrogel technology'),
  ('Solid 160', 'solid-160', 'solid', 'Unflavored', 45, 'g', 160, 40, 20, 0, 0, 65, null, 'Smaller solid fuel option'),
  ('Solid 225 Caf 100', 'solid-225-caf-100', 'solid', 'Unflavored', 60, 'g', 225, 56, 28, 0, 0, 90, 100, 'Solid with 100mg caffeine'),
  ('Bicarb System', 'bicarb-system', 'capsule', 'Unflavored', 5, 'g', 0, 0, 0, 0, 0, 1680, null, 'Sodium bicarbonate loading system')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'maurten'
on conflict (brand_id, slug) do nothing;

-- GU Energy Products (expanded)
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Energy Gel', 'energy-gel-salted-caramel', 'gel', 'Salted Caramel', 32, 'g', 100, 22, 6, 0, 0, 55, 20, 'Original GU gel formula'),
  ('Energy Gel', 'energy-gel-chocolate', 'gel', 'Chocolate Outrage', 32, 'g', 100, 22, 6, 0, 0, 55, 20, 'Original GU gel formula'),
  ('Energy Gel', 'energy-gel-tri-berry', 'gel', 'Tri-Berry', 32, 'g', 100, 22, 6, 0, 0, 55, null, 'Caffeine-free'),
  ('Energy Gel', 'energy-gel-vanilla', 'gel', 'Vanilla Bean', 32, 'g', 100, 22, 6, 0, 0, 55, null, 'Caffeine-free'),
  ('Energy Gel', 'energy-gel-strawberry-banana', 'gel', 'Strawberry Banana', 32, 'g', 100, 22, 6, 0, 0, 55, null, 'Caffeine-free'),
  ('Energy Gel', 'energy-gel-mandarin', 'gel', 'Mandarin Orange', 32, 'g', 100, 22, 6, 0, 0, 55, null, 'Caffeine-free'),
  ('Energy Gel', 'energy-gel-lemon', 'gel', 'Lemon Sublime', 32, 'g', 100, 22, 6, 0, 0, 55, 20, 'With caffeine'),
  ('Energy Gel', 'energy-gel-espresso', 'gel', 'Espresso Love', 32, 'g', 100, 22, 6, 0, 0, 55, 40, 'Double caffeine'),
  ('Energy Gel Jet Blackberry', 'energy-gel-jet-blackberry', 'gel', 'Jet Blackberry', 32, 'g', 100, 22, 6, 0, 0, 55, 40, 'Double caffeine formula'),
  ('Roctane Ultra Endurance Gel', 'roctane-gel-cherry', 'gel', 'Cherry Lime', 32, 'g', 100, 21, 5, 0, 0, 125, 35, 'Premium formula with amino acids'),
  ('Roctane Ultra Endurance Gel', 'roctane-gel-vanilla', 'gel', 'Vanilla Orange', 32, 'g', 100, 21, 5, 0, 0, 125, 35, 'Premium formula with amino acids'),
  ('Roctane Ultra Endurance Gel', 'roctane-gel-sea-salt', 'gel', 'Sea Salt Chocolate', 32, 'g', 100, 21, 5, 0, 0, 125, 35, 'Premium formula with amino acids'),
  ('Roctane Ultra Endurance Gel', 'roctane-gel-blueberry', 'gel', 'Blueberry Pomegranate', 32, 'g', 100, 21, 5, 0, 0, 125, null, 'Caffeine-free Roctane'),
  ('Energy Chews', 'energy-chews-watermelon', 'chew', 'Watermelon', 34, 'g', 90, 23, 12, 0, 0, 50, 20, '4 chews per serving'),
  ('Energy Chews', 'energy-chews-strawberry', 'chew', 'Strawberry', 34, 'g', 90, 23, 12, 0, 0, 50, null, '4 chews per serving, caffeine-free'),
  ('Energy Chews', 'energy-chews-orange', 'chew', 'Orange', 34, 'g', 90, 23, 12, 0, 0, 50, null, '4 chews per serving, caffeine-free'),
  ('Energy Chews', 'energy-chews-blueberry-pom', 'chew', 'Blueberry Pomegranate', 34, 'g', 90, 23, 12, 0, 0, 50, 40, '4 chews per serving, with caffeine'),
  ('Hydration Drink Tabs', 'hydration-tabs-lemon', 'chew', 'Lemon Lime', 4, 'g', 10, 2, 1, 0, 0, 320, null, 'Zero calorie electrolyte tablets'),
  ('Hydration Drink Tabs', 'hydration-tabs-strawberry', 'chew', 'Strawberry Lemonade', 4, 'g', 10, 2, 1, 0, 0, 320, null, 'Zero calorie electrolyte tablets'),
  ('Hydration Drink Tabs', 'hydration-tabs-orange', 'chew', 'Orange', 4, 'g', 10, 2, 1, 0, 0, 320, null, 'Zero calorie electrolyte tablets'),
  ('Energy Stroopwafel', 'stroopwafel-chocolate', 'solid', 'Salted Chocolate', 32, 'g', 150, 22, 10, 2, 5, 50, null, 'Dutch-style waffle snack'),
  ('Energy Stroopwafel', 'stroopwafel-caramel', 'solid', 'Caramel Coffee', 32, 'g', 150, 22, 10, 2, 5, 50, 20, 'Dutch-style waffle snack with caffeine'),
  ('Energy Stroopwafel', 'stroopwafel-wild-berry', 'solid', 'Wild Berry', 32, 'g', 150, 22, 10, 2, 5, 50, null, 'Dutch-style waffle snack'),
  ('Hydration Drink Mix', 'hydration-mix-lemon', 'drink_mix', 'Lemon Lime', 24, 'g', 90, 22, 6, 0, 0, 320, null, 'Electrolyte drink mix'),
  ('Roctane Energy Drink Mix', 'roctane-drink-lemon', 'drink_mix', 'Lemon Berry', 70, 'g', 250, 59, 12, 0, 0, 500, 35, 'Premium endurance drink')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'gu-energy'
on conflict (brand_id, slug) do nothing;

-- Sponser Products
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Liquid Energy Gel', 'liquid-energy-gel-neutral', 'gel', 'Neutral', 70, 'g', 182, 45, 23, 0, 0, 30, null, 'Liquid gel, easy to consume'),
  ('Liquid Energy Gel', 'liquid-energy-gel-cola', 'gel', 'Cola', 70, 'g', 182, 45, 23, 0, 0, 30, 50, 'With caffeine'),
  ('Liquid Energy Gel', 'liquid-energy-gel-peach', 'gel', 'Peach', 70, 'g', 182, 45, 23, 0, 0, 30, null, 'Liquid gel, easy to consume'),
  ('Liquid Energy Gel', 'liquid-energy-gel-mint', 'gel', 'Mint', 70, 'g', 182, 45, 23, 0, 0, 30, 75, 'With caffeine'),
  ('Liquid Energy Plus Gel', 'liquid-energy-plus-gel', 'gel', 'Neutral', 70, 'g', 182, 45, 23, 0, 0, 30, 100, 'High caffeine formula'),
  ('Energy Bar', 'energy-bar-hazelnut', 'bar', 'Hazelnut Chocolate', 45, 'g', 180, 27, 14, 4, 6, 20, null, 'Classic energy bar'),
  ('Energy Bar', 'energy-bar-apricot', 'bar', 'Apricot Vanilla', 45, 'g', 175, 28, 15, 3, 5, 20, null, 'Classic energy bar'),
  ('Energy Bar', 'energy-bar-banana', 'bar', 'Banana Chocolate', 45, 'g', 180, 27, 14, 4, 6, 20, null, 'Classic energy bar'),
  ('Oat Pack', 'oat-pack-banana', 'solid', 'Banana', 60, 'g', 228, 36, 12, 5, 7, 40, null, 'Oat-based solid fuel'),
  ('Oat Pack', 'oat-pack-apple', 'solid', 'Apple', 60, 'g', 228, 36, 12, 5, 7, 40, null, 'Oat-based solid fuel'),
  ('Oat Pack', 'oat-pack-macadamia', 'solid', 'Macadamia Chufas', 60, 'g', 240, 34, 10, 5, 9, 40, null, 'Oat-based solid fuel'),
  ('Competition', 'competition-orange', 'drink_mix', 'Orange', 60, 'g', 224, 56, 28, 0, 0, 400, null, 'Competition drink mix'),
  ('Competition', 'competition-citrus', 'drink_mix', 'Citrus', 60, 'g', 224, 56, 28, 0, 0, 400, null, 'Competition drink mix'),
  ('Competition', 'competition-mixed-berry', 'drink_mix', 'Mixed Berry', 60, 'g', 224, 56, 28, 0, 0, 400, null, 'Competition drink mix'),
  ('Long Energy', 'long-energy-citrus', 'drink_mix', 'Citrus', 60, 'g', 220, 55, 25, 0, 0, 300, null, 'Long distance fuel'),
  ('Long Energy', 'long-energy-berry', 'drink_mix', 'Berry', 60, 'g', 220, 55, 25, 0, 0, 300, null, 'Long distance fuel'),
  ('Activator', 'activator-cola', 'liquid', 'Cola', 30, 'ml', 20, 5, 3, 0, 0, 10, 200, 'High caffeine shot'),
  ('Activator', 'activator-citrus', 'liquid', 'Citrus', 30, 'ml', 20, 5, 3, 0, 0, 10, 200, 'High caffeine shot'),
  ('Salt Caps', 'salt-caps', 'capsule', 'Unflavored', 1.5, 'g', 0, 0, 0, 0, 0, 250, null, 'Electrolyte capsules'),
  ('Lactat Buffer', 'lactat-buffer', 'capsule', 'Unflavored', 3, 'g', 0, 0, 0, 0, 0, 0, null, 'Sodium bicarbonate capsules')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'sponser'
on conflict (brand_id, slug) do nothing;

-- MNSTYR Products
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Energy Gel 30', 'energy-gel-30-citrus', 'gel', 'Citrus', 45, 'g', 113, 30, 15, 0, 0, 100, null, '30g carbs, 1:0.8 ratio'),
  ('Energy Gel 30', 'energy-gel-30-berry', 'gel', 'Berry', 45, 'g', 113, 30, 15, 0, 0, 100, null, '30g carbs, 1:0.8 ratio'),
  ('Energy Gel 30', 'energy-gel-30-tropical', 'gel', 'Tropical', 45, 'g', 113, 30, 15, 0, 0, 100, null, '30g carbs, 1:0.8 ratio'),
  ('Energy Gel 30 Caffeine', 'energy-gel-30-caffeine-cola', 'gel', 'Cola', 45, 'g', 113, 30, 15, 0, 0, 100, 75, '30g carbs with 75mg caffeine'),
  ('Energy Gel 30 Caffeine', 'energy-gel-30-caffeine-espresso', 'gel', 'Espresso', 45, 'g', 113, 30, 15, 0, 0, 100, 100, '30g carbs with 100mg caffeine'),
  ('Energy Gel 45', 'energy-gel-45-citrus', 'gel', 'Citrus', 60, 'g', 170, 45, 22, 0, 0, 150, null, '45g carbs, high carb gel'),
  ('Energy Gel 45', 'energy-gel-45-neutral', 'gel', 'Neutral', 60, 'g', 170, 45, 22, 0, 0, 150, null, '45g carbs, high carb gel'),
  ('Energy Bar', 'energy-bar-chocolate', 'bar', 'Chocolate', 50, 'g', 200, 32, 16, 4, 6, 50, null, 'Balanced energy bar'),
  ('Energy Bar', 'energy-bar-peanut', 'bar', 'Peanut Butter', 50, 'g', 210, 30, 14, 5, 8, 50, null, 'Balanced energy bar'),
  ('Energy Bar', 'energy-bar-berry', 'bar', 'Mixed Berry', 50, 'g', 195, 33, 17, 3, 5, 50, null, 'Balanced energy bar'),
  ('Hydration Mix', 'hydration-mix-lemon', 'drink_mix', 'Lemon', 40, 'g', 150, 38, 18, 0, 0, 400, null, 'Isotonic drink mix'),
  ('Hydration Mix', 'hydration-mix-orange', 'drink_mix', 'Orange', 40, 'g', 150, 38, 18, 0, 0, 400, null, 'Isotonic drink mix'),
  ('Hydration Mix', 'hydration-mix-berry', 'drink_mix', 'Berry', 40, 'g', 150, 38, 18, 0, 0, 400, null, 'Isotonic drink mix'),
  ('Fuel 90', 'fuel-90-citrus', 'drink_mix', 'Citrus', 90, 'g', 340, 90, 45, 0, 0, 500, null, '90g carbs per serving'),
  ('Fuel 90', 'fuel-90-neutral', 'drink_mix', 'Neutral', 90, 'g', 340, 90, 45, 0, 0, 500, null, '90g carbs per serving'),
  ('Electrolyte Tabs', 'electrolyte-tabs-lemon', 'chew', 'Lemon', 4, 'g', 8, 2, 0, 0, 0, 300, null, 'Zero calorie electrolytes'),
  ('Electrolyte Tabs', 'electrolyte-tabs-berry', 'chew', 'Berry', 4, 'g', 8, 2, 0, 0, 0, 300, null, 'Zero calorie electrolytes'),
  ('Caffeine Shot', 'caffeine-shot', 'liquid', 'Citrus', 25, 'ml', 15, 4, 2, 0, 0, 0, 200, 'High caffeine shot')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'mnstyr'
on conflict (brand_id, slug) do nothing;

-- High5 Products (expanded)
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Energy Gel', 'energy-gel-orange', 'gel', 'Orange', 40, 'g', 92, 23, 5, 0, 0, 50, null, 'Easy-open sachet'),
  ('Energy Gel', 'energy-gel-berry', 'gel', 'Berry', 40, 'g', 92, 23, 5, 0, 0, 50, null, 'Easy-open sachet'),
  ('Energy Gel', 'energy-gel-banana', 'gel', 'Banana', 40, 'g', 92, 23, 5, 0, 0, 50, null, 'Easy-open sachet'),
  ('Energy Gel', 'energy-gel-apple', 'gel', 'Apple', 40, 'g', 92, 23, 5, 0, 0, 50, null, 'Easy-open sachet'),
  ('Energy Gel Caffeine', 'energy-gel-caffeine-citrus', 'gel', 'Citrus Burst', 40, 'g', 92, 23, 5, 0, 0, 50, 30, 'With 30mg caffeine'),
  ('Energy Gel Caffeine', 'energy-gel-caffeine-espresso', 'gel', 'Espresso', 40, 'g', 92, 23, 5, 0, 0, 50, 30, 'With 30mg caffeine'),
  ('Energy Gel Aqua', 'energy-gel-aqua-orange', 'gel', 'Orange', 66, 'g', 92, 23, 5, 0, 0, 50, null, 'Liquid consistency - no water needed'),
  ('Energy Gel Aqua', 'energy-gel-aqua-berry', 'gel', 'Berry', 66, 'g', 92, 23, 5, 0, 0, 50, null, 'Liquid consistency - no water needed'),
  ('Energy Gel Aqua Caffeine', 'energy-gel-aqua-caffeine', 'gel', 'Citrus', 66, 'g', 92, 23, 5, 0, 0, 50, 30, 'Aqua gel with caffeine'),
  ('Energy Bar', 'energy-bar-banana', 'bar', 'Banana', 55, 'g', 200, 38, 18, 4, 4, 25, null, 'Real fruit energy bar'),
  ('Energy Bar', 'energy-bar-caramel', 'bar', 'Caramel', 55, 'g', 200, 38, 18, 4, 4, 25, null, 'Real fruit energy bar'),
  ('Energy Bar', 'energy-bar-berry', 'bar', 'Berry', 55, 'g', 200, 38, 18, 4, 4, 25, null, 'Real fruit energy bar'),
  ('Zero Electrolyte Drink', 'zero-tabs-berry', 'chew', 'Berry', 4, 'g', 7, 1, 0, 0, 0, 250, null, 'Zero calorie electrolyte tablet'),
  ('Zero Electrolyte Drink', 'zero-tabs-citrus', 'chew', 'Citrus', 4, 'g', 7, 1, 0, 0, 0, 250, null, 'Zero calorie electrolyte tablet'),
  ('Zero Electrolyte Drink', 'zero-tabs-tropical', 'chew', 'Tropical', 4, 'g', 7, 1, 0, 0, 0, 250, null, 'Zero calorie electrolyte tablet'),
  ('Energy Source', 'energy-source-orange', 'drink_mix', 'Orange', 47, 'g', 176, 44, 10, 0, 0, 100, null, '2:1 glucose:fructose energy drink'),
  ('Energy Source', 'energy-source-citrus', 'drink_mix', 'Citrus', 47, 'g', 176, 44, 10, 0, 0, 100, null, '2:1 glucose:fructose energy drink'),
  ('Energy Source Xtreme', 'energy-source-xtreme', 'drink_mix', 'Citrus', 58, 'g', 216, 54, 12, 0, 0, 125, null, 'Higher carb formula'),
  ('4:1 Recovery', 'recovery-41-chocolate', 'powder', 'Chocolate', 50, 'g', 180, 27, 10, 15, 2, 100, null, 'Recovery shake')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'high5'
on conflict (brand_id, slug) do nothing;

-- Precision Hydration Products (expanded)
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('PH 250 Tablets', 'ph-250-tabs', 'chew', 'Unflavored', 4.5, 'g', 5, 1, 0, 0, 0, 250, null, 'Low sodium option'),
  ('PH 500 Tablets', 'ph-500-tabs', 'chew', 'Unflavored', 4.5, 'g', 5, 1, 0, 0, 0, 500, null, 'Moderate sodium'),
  ('PH 1000 Tablets', 'ph-1000-tabs', 'chew', 'Unflavored', 4.5, 'g', 5, 1, 0, 0, 0, 1000, null, 'High sodium for heavy sweaters'),
  ('PH 1500 Tablets', 'ph-1500-tabs', 'chew', 'Unflavored', 4.5, 'g', 5, 1, 0, 0, 0, 1500, null, 'Very high sodium for extreme conditions'),
  ('PF 30 Gel', 'pf-30-gel', 'gel', 'Unflavored', 51, 'g', 113, 30, 7, 0, 0, 200, null, '30g carbs per gel'),
  ('PF 30 Gel Caffeine', 'pf-30-gel-caffeine', 'gel', 'Unflavored', 51, 'g', 113, 30, 7, 0, 0, 200, 100, '30g carbs with 100mg caffeine'),
  ('PF 60 Gel', 'pf-60-gel', 'gel', 'Unflavored', 102, 'g', 226, 60, 14, 0, 0, 400, null, '60g carbs per gel - double serving'),
  ('PF 90 Drink Mix', 'pf-90-mix', 'drink_mix', 'Unflavored', 93, 'g', 347, 90, 22, 0, 0, 500, null, '90g carbs per 500ml'),
  ('PF 90 Drink Mix Caffeine', 'pf-90-mix-caffeine', 'drink_mix', 'Unflavored', 93, 'g', 347, 90, 22, 0, 0, 500, 100, '90g carbs with 100mg caffeine'),
  ('PH 250 Drink Mix', 'ph-250-mix', 'drink_mix', 'Unflavored', 12, 'g', 0, 0, 0, 0, 0, 250, null, 'Low calorie electrolyte mix'),
  ('PH 500 Drink Mix', 'ph-500-mix', 'drink_mix', 'Unflavored', 12, 'g', 0, 0, 0, 0, 0, 500, null, 'Low calorie electrolyte mix'),
  ('PH 1000 Drink Mix', 'ph-1000-mix', 'drink_mix', 'Unflavored', 12, 'g', 0, 0, 0, 0, 0, 1000, null, 'Low calorie electrolyte mix'),
  ('PH 1500 Drink Mix', 'ph-1500-mix', 'drink_mix', 'Unflavored', 12, 'g', 0, 0, 0, 0, 0, 1500, null, 'Low calorie electrolyte mix')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'precision-hydration'
on conflict (brand_id, slug) do nothing;

-- Neversecond Products (expanded)
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('C30 Energy Gel', 'c30-gel-citrus', 'gel', 'Citrus', 60, 'g', 113, 30, 15, 0, 0, 100, null, '30g carbs, 1:0.8 ratio'),
  ('C30 Energy Gel', 'c30-gel-passion-fruit', 'gel', 'Passion Fruit', 60, 'g', 113, 30, 15, 0, 0, 100, null, '30g carbs, 1:0.8 ratio'),
  ('C30 Energy Gel', 'c30-gel-mango', 'gel', 'Mango', 60, 'g', 113, 30, 15, 0, 0, 100, null, '30g carbs, 1:0.8 ratio'),
  ('C30+ Caffeine Gel', 'c30-caffeine-gel-cola', 'gel', 'Cola', 60, 'g', 113, 30, 15, 0, 0, 100, 75, '30g carbs with 75mg caffeine'),
  ('C30+ Caffeine Gel', 'c30-caffeine-gel-espresso', 'gel', 'Espresso', 60, 'g', 113, 30, 15, 0, 0, 100, 75, '30g carbs with 75mg caffeine'),
  ('C90 High Carb Drink Mix', 'c90-mix-citrus', 'drink_mix', 'Citrus', 90, 'g', 360, 90, 45, 0, 0, 250, null, '90g carbs per serving'),
  ('C90 High Carb Drink Mix', 'c90-mix-mango', 'drink_mix', 'Mango', 90, 'g', 360, 90, 45, 0, 0, 250, null, '90g carbs per serving'),
  ('C30 Sports Drink', 'c30-drink-citrus', 'drink_mix', 'Citrus', 38, 'g', 113, 30, 15, 0, 0, 250, null, '30g carbs isotonic drink'),
  ('C30 Sports Drink', 'c30-drink-berry', 'drink_mix', 'Berry', 38, 'g', 113, 30, 15, 0, 0, 250, null, '30g carbs isotonic drink'),
  ('C30 Energy Bar', 'c30-bar-cocoa', 'bar', 'Cocoa', 45, 'g', 170, 30, 14, 3, 4, 80, null, '30g carbs energy bar'),
  ('C30 Energy Bar', 'c30-bar-banana', 'bar', 'Banana', 45, 'g', 170, 30, 14, 3, 4, 80, null, '30g carbs energy bar')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'neversecond'
on conflict (brand_id, slug) do nothing;

-- Tailwind Nutrition Products (expanded)
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Endurance Fuel', 'endurance-fuel-mandarin', 'drink_mix', 'Mandarin Orange', 27, 'g', 100, 25, 12, 0, 0, 303, null, 'All-in-one endurance fuel'),
  ('Endurance Fuel', 'endurance-fuel-lemon', 'drink_mix', 'Lemon', 27, 'g', 100, 25, 12, 0, 0, 303, null, 'All-in-one endurance fuel'),
  ('Endurance Fuel', 'endurance-fuel-berry', 'drink_mix', 'Berry', 27, 'g', 100, 25, 12, 0, 0, 303, null, 'All-in-one endurance fuel'),
  ('Endurance Fuel', 'endurance-fuel-grape', 'drink_mix', 'Grape', 27, 'g', 100, 25, 12, 0, 0, 303, null, 'All-in-one endurance fuel'),
  ('Endurance Fuel', 'endurance-fuel-raspberry', 'drink_mix', 'Raspberry Buzz', 27, 'g', 100, 25, 12, 0, 0, 303, 35, 'With 35mg caffeine per serving'),
  ('Endurance Fuel', 'endurance-fuel-cola', 'drink_mix', 'Colorado Cola', 27, 'g', 100, 25, 12, 0, 0, 303, 35, 'With 35mg caffeine per serving'),
  ('Endurance Fuel', 'endurance-fuel-tropical', 'drink_mix', 'Tropical Buzz', 27, 'g', 100, 25, 12, 0, 0, 303, 35, 'With 35mg caffeine per serving'),
  ('Endurance Fuel', 'endurance-fuel-naked', 'drink_mix', 'Unflavored', 27, 'g', 100, 25, 12, 0, 0, 303, null, 'Unflavored option'),
  ('Rebuild Recovery', 'rebuild-recovery-chocolate', 'powder', 'Chocolate', 50, 'g', 190, 32, 14, 10, 2, 290, null, 'Post-workout recovery mix'),
  ('Rebuild Recovery', 'rebuild-recovery-vanilla', 'powder', 'Vanilla', 50, 'g', 190, 32, 14, 10, 2, 290, null, 'Post-workout recovery mix')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'tailwind-nutrition'
on conflict (brand_id, slug) do nothing;

-- Clif Bar Products (expanded)
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Clif Bar', 'clif-bar-chocolate', 'bar', 'Chocolate Chip', 68, 'g', 250, 44, 21, 10, 5, 150, null, 'Original energy bar'),
  ('Clif Bar', 'clif-bar-peanut', 'bar', 'Crunchy Peanut Butter', 68, 'g', 250, 42, 21, 11, 6, 200, null, 'Original energy bar'),
  ('Clif Bar', 'clif-bar-oatmeal', 'bar', 'Oatmeal Raisin Walnut', 68, 'g', 240, 43, 22, 9, 5, 150, null, 'Original energy bar'),
  ('Clif Bar', 'clif-bar-white-chocolate', 'bar', 'White Chocolate Macadamia', 68, 'g', 250, 43, 22, 9, 6, 150, null, 'Original energy bar'),
  ('Clif Bar', 'clif-bar-brownie', 'bar', 'Chocolate Brownie', 68, 'g', 240, 44, 21, 10, 4, 150, null, 'Original energy bar'),
  ('Clif Bar', 'clif-bar-blueberry', 'bar', 'Blueberry Crisp', 68, 'g', 250, 44, 21, 10, 5, 150, null, 'Original energy bar'),
  ('Clif Bloks', 'clif-bloks-citrus', 'chew', 'Citrus', 60, 'g', 180, 45, 24, 0, 0, 70, null, '6 chews per package'),
  ('Clif Bloks', 'clif-bloks-strawberry', 'chew', 'Strawberry', 60, 'g', 180, 45, 24, 0, 0, 70, null, '6 chews per package'),
  ('Clif Bloks', 'clif-bloks-mountain-berry', 'chew', 'Mountain Berry', 60, 'g', 180, 45, 24, 0, 0, 70, null, '6 chews per package'),
  ('Clif Bloks', 'clif-bloks-margarita', 'chew', 'Margarita', 60, 'g', 180, 45, 24, 0, 0, 140, null, '6 chews per package - extra sodium'),
  ('Clif Bloks', 'clif-bloks-cherry', 'chew', 'Black Cherry', 60, 'g', 180, 45, 24, 0, 0, 70, 50, 'With 50mg caffeine'),
  ('Clif Bloks', 'clif-bloks-tropical', 'chew', 'Tropical Punch', 60, 'g', 180, 45, 24, 0, 0, 70, 25, 'With 25mg caffeine'),
  ('Clif Shot Gel', 'clif-shot-gel-mocha', 'gel', 'Mocha', 34, 'g', 100, 24, 12, 0, 0, 60, 50, 'Organic energy gel'),
  ('Clif Shot Gel', 'clif-shot-gel-chocolate', 'gel', 'Chocolate', 34, 'g', 100, 24, 12, 0, 0, 60, 25, 'Organic energy gel'),
  ('Clif Shot Gel', 'clif-shot-gel-citrus', 'gel', 'Citrus', 34, 'g', 100, 24, 12, 0, 0, 60, 25, 'Organic energy gel'),
  ('Clif Shot Gel', 'clif-shot-gel-vanilla', 'gel', 'Vanilla', 34, 'g', 100, 24, 12, 0, 0, 60, null, 'Caffeine-free gel'),
  ('Clif Shot Gel', 'clif-shot-gel-razz', 'gel', 'Razz', 34, 'g', 100, 24, 12, 0, 0, 60, null, 'Caffeine-free gel'),
  ('Clif Shot Gel', 'clif-shot-gel-strawberry', 'gel', 'Strawberry', 34, 'g', 100, 24, 12, 0, 0, 60, null, 'Caffeine-free gel')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'clif-bar'
on conflict (brand_id, slug) do nothing;

-- Skratch Labs Products (expanded)
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Sport Hydration Drink Mix', 'sport-hydration-mix-lemon', 'drink_mix', 'Lemon & Lime', 22, 'g', 80, 20, 16, 0, 0, 380, null, 'Real fruit hydration mix'),
  ('Sport Hydration Drink Mix', 'sport-hydration-mix-orange', 'drink_mix', 'Oranges', 22, 'g', 80, 20, 16, 0, 0, 380, null, 'Real fruit hydration mix'),
  ('Sport Hydration Drink Mix', 'sport-hydration-mix-raspberry', 'drink_mix', 'Raspberry', 22, 'g', 80, 20, 16, 0, 0, 380, null, 'Real fruit hydration mix'),
  ('Sport Hydration Drink Mix', 'sport-hydration-mix-strawberry', 'drink_mix', 'Strawberry Lemonade', 22, 'g', 80, 20, 16, 0, 0, 380, null, 'Real fruit hydration mix'),
  ('Sport Hydration Drink Mix', 'sport-hydration-mix-pineapple', 'drink_mix', 'Pineapple', 22, 'g', 80, 20, 16, 0, 0, 380, null, 'Real fruit hydration mix'),
  ('Sport Hydration Drink Mix', 'sport-hydration-mix-matcha', 'drink_mix', 'Matcha & Lemon', 22, 'g', 80, 20, 16, 0, 0, 380, 19, 'With natural caffeine'),
  ('Superfuel Drink Mix', 'superfuel-mix-lemon', 'drink_mix', 'Lemon & Lime', 55, 'g', 400, 100, 8, 0, 0, 800, null, 'Cluster dextrin for high carb fueling'),
  ('Superfuel Drink Mix', 'superfuel-mix-raspberry', 'drink_mix', 'Raspberry', 55, 'g', 400, 100, 8, 0, 0, 800, null, 'Cluster dextrin for high carb fueling'),
  ('Energy Chews', 'energy-chews-raspberry', 'chew', 'Raspberry', 50, 'g', 160, 40, 24, 0, 0, 80, null, 'Real fruit energy chews'),
  ('Energy Chews', 'energy-chews-orange', 'chew', 'Orange', 50, 'g', 160, 40, 24, 0, 0, 80, null, 'Real fruit energy chews'),
  ('Energy Chews', 'energy-chews-sour-cherry', 'chew', 'Sour Cherry', 50, 'g', 160, 40, 24, 0, 0, 80, null, 'Real fruit energy chews'),
  ('Anytime Energy Bar', 'anytime-bar-chocolate', 'bar', 'Chocolate Chip & Almond', 50, 'g', 220, 26, 12, 6, 10, 180, null, 'Whole food energy bar'),
  ('Anytime Energy Bar', 'anytime-bar-cherry', 'bar', 'Cherry & Pistachio', 50, 'g', 220, 26, 12, 6, 10, 180, null, 'Whole food energy bar'),
  ('Anytime Energy Bar', 'anytime-bar-mango', 'bar', 'Mango & Chili', 50, 'g', 220, 26, 12, 6, 10, 180, null, 'Whole food energy bar'),
  ('Crispy Rice Cake', 'crispy-rice-chocolate', 'solid', 'Chocolate & Mallow', 45, 'g', 180, 33, 12, 2, 4, 95, null, 'Portable rice cake'),
  ('Crispy Rice Cake', 'crispy-rice-strawberry', 'solid', 'Strawberry & Mallow', 45, 'g', 180, 33, 12, 2, 4, 95, null, 'Portable rice cake')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'skratch-labs'
on conflict (brand_id, slug) do nothing;

-- Nduranz Products
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Nrgy Unit Gel', 'nrgy-gel-orange', 'gel', 'Orange', 45, 'g', 170, 45, 22, 0, 0, 100, null, '45g carbs per gel'),
  ('Nrgy Unit Gel', 'nrgy-gel-lemon', 'gel', 'Lemon', 45, 'g', 170, 45, 22, 0, 0, 100, null, '45g carbs per gel'),
  ('Nrgy Unit Gel', 'nrgy-gel-neutral', 'gel', 'Neutral', 45, 'g', 170, 45, 22, 0, 0, 100, null, '45g carbs per gel'),
  ('Nrgy Unit Gel Caffeine', 'nrgy-gel-caffeine', 'gel', 'Cola', 45, 'g', 170, 45, 22, 0, 0, 100, 100, '45g carbs with 100mg caffeine'),
  ('Nrgy Unit Drink', 'nrgy-drink-orange', 'drink_mix', 'Orange', 45, 'g', 170, 45, 22, 0, 0, 350, null, '45g carbs drink mix'),
  ('Nrgy Unit Drink', 'nrgy-drink-lemon', 'drink_mix', 'Lemon', 45, 'g', 170, 45, 22, 0, 0, 350, null, '45g carbs drink mix'),
  ('Nrgy Unit Drink 90', 'nrgy-drink-90-orange', 'drink_mix', 'Orange', 90, 'g', 340, 90, 44, 0, 0, 700, null, '90g carbs drink mix'),
  ('Nrgy Unit Bar', 'nrgy-bar-chocolate', 'bar', 'Chocolate', 45, 'g', 180, 30, 15, 3, 5, 80, null, 'Energy bar'),
  ('Nrgy Unit Bar', 'nrgy-bar-hazelnut', 'bar', 'Hazelnut', 45, 'g', 185, 28, 14, 4, 6, 80, null, 'Energy bar')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'nduranz'
on conflict (brand_id, slug) do nothing;

-- Styrkr Products
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Gel30 Dual-Carb', 'gel30-citrus', 'gel', 'Citrus', 60, 'g', 113, 30, 15, 0, 0, 100, null, '30g carbs, 1:0.8 ratio'),
  ('Gel30 Dual-Carb', 'gel30-berry', 'gel', 'Berry', 60, 'g', 113, 30, 15, 0, 0, 100, null, '30g carbs, 1:0.8 ratio'),
  ('Gel30 Dual-Carb', 'gel30-tropical', 'gel', 'Tropical', 60, 'g', 113, 30, 15, 0, 0, 100, null, '30g carbs, 1:0.8 ratio'),
  ('Gel30 Nitro', 'gel30-nitro-cola', 'gel', 'Cola', 60, 'g', 113, 30, 15, 0, 0, 100, 75, 'With 75mg caffeine'),
  ('Gel30 Nitro', 'gel30-nitro-mint', 'gel', 'Mint', 60, 'g', 113, 30, 15, 0, 0, 100, 150, 'With 150mg caffeine'),
  ('Mix60 Dual-Carb', 'mix60-citrus', 'drink_mix', 'Citrus', 65, 'g', 240, 60, 30, 0, 0, 400, null, '60g carbs drink mix'),
  ('Mix60 Dual-Carb', 'mix60-berry', 'drink_mix', 'Berry', 65, 'g', 240, 60, 30, 0, 0, 400, null, '60g carbs drink mix'),
  ('Mix90 Dual-Carb', 'mix90-citrus', 'drink_mix', 'Citrus', 95, 'g', 360, 90, 45, 0, 0, 600, null, '90g carbs drink mix'),
  ('Bar50', 'bar50-chocolate', 'bar', 'Chocolate', 50, 'g', 200, 32, 16, 4, 6, 100, null, '50g bar with balanced carbs'),
  ('Bar50', 'bar50-caramel', 'bar', 'Salted Caramel', 50, 'g', 200, 32, 16, 4, 6, 100, null, '50g bar with balanced carbs')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'styrkr'
on conflict (brand_id, slug) do nothing;

-- Torq Products
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Energy Gel', 'energy-gel-orange', 'gel', 'Orange', 45, 'g', 114, 28, 14, 0, 0, 50, null, 'Natural energy gel'),
  ('Energy Gel', 'energy-gel-cherry', 'gel', 'Cherry Bakewell', 45, 'g', 114, 28, 14, 0, 0, 50, null, 'Natural energy gel'),
  ('Energy Gel', 'energy-gel-rhubarb', 'gel', 'Rhubarb & Custard', 45, 'g', 114, 28, 14, 0, 0, 50, null, 'Natural energy gel'),
  ('Energy Gel', 'energy-gel-apple', 'gel', 'Apple Crumble', 45, 'g', 114, 28, 14, 0, 0, 50, null, 'Natural energy gel'),
  ('Energy Gel', 'energy-gel-forest-fruits', 'gel', 'Forest Fruits', 45, 'g', 114, 28, 14, 0, 0, 50, null, 'Natural energy gel'),
  ('Energy Gel Caffeine', 'energy-gel-caffeine-guarana', 'gel', 'Guarana', 45, 'g', 114, 28, 14, 0, 0, 50, 89, 'With natural caffeine'),
  ('Energy Bar', 'energy-bar-organic-ginger', 'bar', 'Organic Ginger', 45, 'g', 177, 26, 13, 3, 6, 20, null, 'Organic energy bar'),
  ('Energy Bar', 'energy-bar-organic-apricot', 'bar', 'Organic Apricot', 45, 'g', 177, 26, 13, 3, 6, 20, null, 'Organic energy bar'),
  ('Energy Bar', 'energy-bar-organic-sundried', 'bar', 'Organic Sundried Banana', 45, 'g', 177, 26, 13, 3, 6, 20, null, 'Organic energy bar'),
  ('Hydration Drink', 'hydration-drink-orange', 'drink_mix', 'Orange', 30, 'g', 114, 28, 14, 0, 0, 200, null, 'Isotonic drink mix'),
  ('Hydration Drink', 'hydration-drink-lemon', 'drink_mix', 'Lemon', 30, 'g', 114, 28, 14, 0, 0, 200, null, 'Isotonic drink mix'),
  ('Energy Chew', 'energy-chew-orange', 'chew', 'Orange', 6, 'g', 23, 5.5, 2.8, 0, 0, 10, null, 'Individual energy chew'),
  ('Energy Chew', 'energy-chew-cherry', 'chew', 'Cherry', 6, 'g', 23, 5.5, 2.8, 0, 0, 10, null, 'Individual energy chew')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'torq'
on conflict (brand_id, slug) do nothing;

-- Enervit Products
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Enervitene Sport Gel', 'enervitene-gel-orange', 'gel', 'Orange', 25, 'ml', 53, 13, 6, 0, 0, 30, null, 'Compact gel'),
  ('Enervitene Sport Gel', 'enervitene-gel-lemon', 'gel', 'Lemon', 25, 'ml', 53, 13, 6, 0, 0, 30, null, 'Compact gel'),
  ('Enervitene Sport Gel', 'enervitene-gel-cola', 'gel', 'Cola', 25, 'ml', 53, 13, 6, 0, 0, 30, 25, 'With caffeine'),
  ('Enervitene Sport Gel One Hand', 'enervitene-gel-one-hand', 'gel', 'Orange', 12.5, 'ml', 27, 6.5, 3, 0, 0, 15, null, 'Easy squeeze gel'),
  ('Enervit C2:1Pro', 'c21pro-gel-orange', 'gel', 'Orange', 60, 'ml', 120, 30, 15, 0, 0, 100, null, '30g carbs, 2:1 ratio'),
  ('Enervit C2:1Pro', 'c21pro-gel-lemon', 'gel', 'Lemon', 60, 'ml', 120, 30, 15, 0, 0, 100, null, '30g carbs, 2:1 ratio'),
  ('Enervit C2:1Pro Caffeine', 'c21pro-gel-caffeine', 'gel', 'Cola', 60, 'ml', 120, 30, 15, 0, 0, 100, 50, 'With 50mg caffeine'),
  ('Power Sport Bar', 'power-sport-bar-cacao', 'bar', 'Double Cacao', 40, 'g', 155, 23, 11, 5, 4, 50, null, 'Performance bar'),
  ('Power Sport Bar', 'power-sport-bar-lemon', 'bar', 'Lemon Cream', 40, 'g', 155, 23, 11, 5, 4, 50, null, 'Performance bar'),
  ('Isotonic Drink', 'isotonic-drink-lemon', 'drink_mix', 'Lemon', 30, 'g', 110, 27, 14, 0, 0, 200, null, 'Isotonic formula'),
  ('Isotonic Drink', 'isotonic-drink-orange', 'drink_mix', 'Orange', 30, 'g', 110, 27, 14, 0, 0, 200, null, 'Isotonic formula'),
  ('Carbo Flow', 'carbo-flow', 'drink_mix', 'Neutral', 45, 'g', 170, 43, 21, 0, 0, 150, null, 'High carb drink mix')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'enervit'
on conflict (brand_id, slug) do nothing;

-- Powerbar Products
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('PowerGel Original', 'powergel-original-lemon', 'gel', 'Lemon Lime', 41, 'g', 108, 27, 10, 0, 0, 50, null, 'Classic energy gel'),
  ('PowerGel Original', 'powergel-original-strawberry', 'gel', 'Strawberry Banana', 41, 'g', 108, 27, 10, 0, 0, 50, null, 'Classic energy gel'),
  ('PowerGel Original', 'powergel-original-vanilla', 'gel', 'Vanilla', 41, 'g', 108, 27, 10, 0, 0, 50, null, 'Classic energy gel'),
  ('PowerGel Original', 'powergel-original-chocolate', 'gel', 'Chocolate', 41, 'g', 108, 27, 10, 0, 0, 50, null, 'Classic energy gel'),
  ('PowerGel Original Caffeine', 'powergel-caffeine-cola', 'gel', 'Cola', 41, 'g', 108, 27, 10, 0, 0, 50, 50, 'With 50mg caffeine'),
  ('PowerGel Original Caffeine', 'powergel-caffeine-green-apple', 'gel', 'Green Apple', 41, 'g', 108, 27, 10, 0, 0, 50, 50, 'With 50mg caffeine'),
  ('PowerGel Hydro', 'powergel-hydro-cherry', 'gel', 'Cherry', 67, 'ml', 108, 27, 10, 0, 0, 50, null, 'Hydro gel - no water needed'),
  ('PowerGel Hydro', 'powergel-hydro-cola', 'gel', 'Cola', 67, 'ml', 108, 27, 10, 0, 0, 50, 75, 'Hydro gel with caffeine'),
  ('PowerGel Hydro', 'powergel-hydro-orange', 'gel', 'Orange', 67, 'ml', 108, 27, 10, 0, 0, 50, null, 'Hydro gel - no water needed'),
  ('Energize Bar', 'energize-bar-chocolate', 'bar', 'Chocolate', 55, 'g', 196, 34, 18, 5, 4, 80, null, 'Energy bar'),
  ('Energize Bar', 'energize-bar-berry', 'bar', 'Berry', 55, 'g', 196, 34, 18, 5, 4, 80, null, 'Energy bar'),
  ('Energize Bar', 'energize-bar-banana', 'bar', 'Banana Punch', 55, 'g', 196, 34, 18, 5, 4, 80, null, 'Energy bar'),
  ('Natural Energy Bar', 'natural-energy-bar-cacao', 'bar', 'Cacao Crunch', 40, 'g', 143, 23, 13, 3, 4, 20, null, 'Natural ingredients'),
  ('Natural Energy Bar', 'natural-energy-bar-strawberry', 'bar', 'Strawberry & Cranberry', 40, 'g', 143, 23, 13, 3, 4, 20, null, 'Natural ingredients'),
  ('Isoactive', 'isoactive-lemon', 'drink_mix', 'Lemon', 33, 'g', 124, 31, 15, 0, 0, 250, null, 'Isotonic drink mix'),
  ('Isoactive', 'isoactive-orange', 'drink_mix', 'Orange', 33, 'g', 124, 31, 15, 0, 0, 250, null, 'Isotonic drink mix'),
  ('PowerGel Shots', 'powergel-shots-raspberry', 'chew', 'Raspberry', 60, 'g', 178, 44, 22, 0, 0, 50, null, 'Energy chews'),
  ('PowerGel Shots', 'powergel-shots-cola', 'chew', 'Cola', 60, 'g', 178, 44, 22, 0, 0, 50, 75, 'Energy chews with caffeine')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'powerbar'
on conflict (brand_id, slug) do nothing;

-- Hammer Nutrition Products
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Hammer Gel', 'hammer-gel-vanilla', 'gel', 'Vanilla', 33, 'g', 90, 22, 2, 0, 0, 20, null, 'No simple sugars'),
  ('Hammer Gel', 'hammer-gel-chocolate', 'gel', 'Chocolate', 33, 'g', 90, 22, 2, 0, 0, 20, null, 'No simple sugars'),
  ('Hammer Gel', 'hammer-gel-raspberry', 'gel', 'Raspberry', 33, 'g', 90, 22, 2, 0, 0, 20, null, 'No simple sugars'),
  ('Hammer Gel', 'hammer-gel-banana', 'gel', 'Banana', 33, 'g', 90, 22, 2, 0, 0, 20, null, 'No simple sugars'),
  ('Hammer Gel', 'hammer-gel-apple', 'gel', 'Apple Cinnamon', 33, 'g', 90, 22, 2, 0, 0, 20, null, 'No simple sugars'),
  ('Hammer Gel', 'hammer-gel-tropical', 'gel', 'Tropical', 33, 'g', 90, 22, 2, 0, 0, 20, 50, 'With caffeine'),
  ('Hammer Gel', 'hammer-gel-espresso', 'gel', 'Espresso', 33, 'g', 90, 22, 2, 0, 0, 20, 50, 'With caffeine'),
  ('Hammer Bar', 'hammer-bar-chocolate', 'bar', 'Chocolate Chip', 50, 'g', 210, 27, 4, 7, 8, 20, null, 'Endurance bar'),
  ('Hammer Bar', 'hammer-bar-almond', 'bar', 'Almond Raisin', 50, 'g', 210, 27, 4, 7, 8, 20, null, 'Endurance bar'),
  ('Hammer Bar', 'hammer-bar-oatmeal', 'bar', 'Oatmeal Apple', 50, 'g', 210, 27, 4, 7, 8, 20, null, 'Endurance bar'),
  ('Heed', 'heed-lemon', 'drink_mix', 'Lemon Lime', 28, 'g', 100, 25, 2, 0, 0, 100, null, 'No simple sugars drink'),
  ('Heed', 'heed-mandarin', 'drink_mix', 'Mandarin Orange', 28, 'g', 100, 25, 2, 0, 0, 100, null, 'No simple sugars drink'),
  ('Heed', 'heed-melon', 'drink_mix', 'Melon', 28, 'g', 100, 25, 2, 0, 0, 100, null, 'No simple sugars drink'),
  ('Perpetuem', 'perpetuem-orange', 'drink_mix', 'Orange Vanilla', 54, 'g', 200, 39, 4, 7, 2, 150, null, 'Ultra-endurance fuel'),
  ('Perpetuem', 'perpetuem-strawberry', 'drink_mix', 'Strawberry Vanilla', 54, 'g', 200, 39, 4, 7, 2, 150, null, 'Ultra-endurance fuel'),
  ('Perpetuem', 'perpetuem-caffeine', 'drink_mix', 'Caffè Latte', 54, 'g', 200, 39, 4, 7, 2, 150, 25, 'With caffeine'),
  ('Endurolytes', 'endurolytes-capsules', 'capsule', 'Unflavored', 1, 'g', 0, 0, 0, 0, 0, 100, null, 'Electrolyte capsules'),
  ('Endurolytes Fizz', 'endurolytes-fizz-lemon', 'chew', 'Lemon Lime', 4, 'g', 10, 2, 0, 0, 0, 200, null, 'Effervescent electrolytes')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'hammer-nutrition'
on conflict (brand_id, slug) do nothing;

-- Veloforte Products
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Nectar Energy Gel', 'nectar-gel-citrus', 'gel', 'Citrus & Mint', 33, 'g', 92, 22, 16, 0, 0, 50, null, 'Real food gel'),
  ('Nectar Energy Gel', 'nectar-gel-blood-orange', 'gel', 'Blood Orange & Ginger', 33, 'g', 92, 22, 16, 0, 0, 50, null, 'Real food gel'),
  ('Nectar Energy Gel', 'nectar-gel-rhubarb', 'gel', 'Rhubarb & Custard', 33, 'g', 92, 22, 16, 0, 0, 50, null, 'Real food gel'),
  ('Doppio Energy Gel', 'doppio-gel-mocca', 'gel', 'Mocca', 33, 'g', 92, 22, 16, 0, 0, 50, 75, 'With 75mg caffeine'),
  ('Doppio Energy Gel', 'doppio-gel-verde', 'gel', 'Verde (Matcha)', 33, 'g', 92, 22, 16, 0, 0, 50, 40, 'With matcha caffeine'),
  ('Classico Energy Bar', 'classico-bar-ciocco', 'bar', 'Ciocco (Fig & Cacao)', 62, 'g', 249, 36, 24, 5, 9, 30, null, 'Natural energy bar'),
  ('Classico Energy Bar', 'classico-bar-zenzero', 'bar', 'Zenzero (Ginger & Lemon)', 62, 'g', 249, 36, 24, 5, 9, 30, null, 'Natural energy bar'),
  ('Classico Energy Bar', 'classico-bar-di-bosco', 'bar', 'Di Bosco (Berries)', 62, 'g', 249, 36, 24, 5, 9, 30, null, 'Natural energy bar'),
  ('Classico Energy Bar', 'classico-bar-avena', 'bar', 'Avena (Apricot & Almond)', 62, 'g', 249, 36, 24, 5, 9, 30, null, 'Natural energy bar'),
  ('Forza Chews', 'forza-chews-citrus', 'chew', 'Citrus', 45, 'g', 140, 35, 25, 0, 0, 50, null, 'Natural energy chews'),
  ('Forza Chews', 'forza-chews-berry', 'chew', 'Berry', 45, 'g', 140, 35, 25, 0, 0, 50, null, 'Natural energy chews'),
  ('Attivo Electrolyte Powder', 'attivo-electrolyte', 'drink_mix', 'Citrus', 10, 'g', 25, 6, 4, 0, 0, 350, null, 'Natural electrolytes'),
  ('Solo Energy Chew', 'solo-chew-citrus', 'chew', 'Citrus & Mint', 13, 'g', 40, 10, 7, 0, 0, 15, null, 'Single energy chew')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'veloforte'
on conflict (brand_id, slug) do nothing;

-- Näak Products
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Ultra Energy Bar', 'ultra-bar-peanut', 'bar', 'Peanut Butter & Chocolate', 50, 'g', 200, 25, 10, 10, 7, 120, null, 'Cricket protein bar'),
  ('Ultra Energy Bar', 'ultra-bar-apple', 'bar', 'Apple Pie', 50, 'g', 200, 25, 10, 10, 7, 120, null, 'Cricket protein bar'),
  ('Ultra Energy Bar', 'ultra-bar-banana', 'bar', 'Banana Chocolate', 50, 'g', 200, 25, 10, 10, 7, 120, null, 'Cricket protein bar'),
  ('Ultra Energy Waffle', 'ultra-waffle-maple', 'solid', 'Maple', 30, 'g', 140, 21, 10, 3, 5, 50, null, 'Waffle with cricket protein'),
  ('Ultra Energy Waffle', 'ultra-waffle-chocolate', 'solid', 'Chocolate', 30, 'g', 140, 21, 10, 3, 5, 50, null, 'Waffle with cricket protein'),
  ('Ultra Energy Gel', 'ultra-gel-maple', 'gel', 'Maple', 32, 'g', 100, 25, 12, 0, 0, 50, null, 'Maple syrup gel'),
  ('Ultra Energy Gel', 'ultra-gel-citrus', 'gel', 'Citrus', 32, 'g', 100, 25, 12, 0, 0, 50, null, 'Citrus gel'),
  ('Ultra Energy Gel', 'ultra-gel-espresso', 'gel', 'Espresso', 32, 'g', 100, 25, 12, 0, 0, 50, 50, 'With caffeine'),
  ('Ultra Energy Drink Mix', 'ultra-drink-lemon', 'drink_mix', 'Lemon', 40, 'g', 150, 37, 18, 0, 0, 300, null, 'Isotonic drink'),
  ('Ultra Energy Drink Mix', 'ultra-drink-berry', 'drink_mix', 'Berry', 40, 'g', 150, 37, 18, 0, 0, 300, null, 'Isotonic drink')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'naak'
on conflict (brand_id, slug) do nothing;

-- Honey Stinger Products
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Organic Energy Gel', 'organic-gel-gold', 'gel', 'Gold', 32, 'g', 100, 24, 11, 0, 0, 50, null, 'Honey-based gel'),
  ('Organic Energy Gel', 'organic-gel-strawberry', 'gel', 'Strawberry Kiwi', 32, 'g', 100, 24, 11, 0, 0, 50, null, 'Honey-based gel'),
  ('Organic Energy Gel', 'organic-gel-fruit-smoothie', 'gel', 'Fruit Smoothie', 32, 'g', 100, 24, 11, 0, 0, 50, null, 'Honey-based gel'),
  ('Organic Energy Gel', 'organic-gel-acai', 'gel', 'Acai & Pomegranate', 32, 'g', 100, 24, 11, 0, 0, 50, null, 'Honey-based gel'),
  ('Organic Energy Gel', 'organic-gel-mango', 'gel', 'Mango Orange', 32, 'g', 100, 24, 11, 0, 0, 50, null, 'Honey-based gel'),
  ('Organic Energy Gel', 'organic-gel-chocolate', 'gel', 'Chocolate', 32, 'g', 100, 24, 11, 0, 0, 50, 32, 'With caffeine'),
  ('Organic Energy Gel', 'organic-gel-ginsting', 'gel', 'Ginsting', 32, 'g', 100, 24, 11, 0, 0, 50, 32, 'With caffeine'),
  ('Organic Stinger Waffle', 'waffle-honey', 'solid', 'Honey', 30, 'g', 140, 21, 11, 1, 6, 50, null, 'Organic waffle'),
  ('Organic Stinger Waffle', 'waffle-vanilla', 'solid', 'Vanilla & Chocolate', 30, 'g', 140, 21, 11, 1, 6, 50, null, 'Organic waffle'),
  ('Organic Stinger Waffle', 'waffle-caramel', 'solid', 'Caramel', 30, 'g', 140, 21, 11, 1, 6, 50, null, 'Organic waffle'),
  ('Organic Stinger Waffle', 'waffle-cinnamon', 'solid', 'Cinnamon', 30, 'g', 140, 21, 11, 1, 6, 50, null, 'Organic waffle'),
  ('Organic Stinger Waffle', 'waffle-ginsting', 'solid', 'Ginsting', 30, 'g', 140, 21, 11, 1, 6, 50, 32, 'With caffeine'),
  ('Organic Energy Chews', 'chews-orange', 'chew', 'Orange Blossom', 50, 'g', 160, 40, 27, 0, 0, 80, null, 'Honey chews'),
  ('Organic Energy Chews', 'chews-cherry', 'chew', 'Cherry Blossom', 50, 'g', 160, 40, 27, 0, 0, 80, null, 'Honey chews'),
  ('Organic Energy Chews', 'chews-lime', 'chew', 'Lime-Ade', 50, 'g', 160, 40, 27, 0, 0, 80, null, 'Honey chews'),
  ('Organic Energy Chews', 'chews-fruit-smoothie', 'chew', 'Fruit Smoothie', 50, 'g', 160, 40, 27, 0, 0, 80, null, 'Honey chews'),
  ('Organic Energy Chews', 'chews-stingerita', 'chew', 'Stingerita', 50, 'g', 160, 40, 27, 0, 0, 160, null, 'Extra sodium'),
  ('Cracker Bar', 'cracker-bar-peanut', 'bar', 'Peanut Butter & Honey', 50, 'g', 200, 29, 14, 5, 7, 150, null, 'Savory snack bar'),
  ('Cracker Bar', 'cracker-bar-almond', 'bar', 'Almond Butter & Honey', 50, 'g', 200, 29, 14, 5, 7, 150, null, 'Savory snack bar')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'honey-stinger'
on conflict (brand_id, slug) do nothing;

-- OTE Sports Products
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Energy Gel', 'energy-gel-lemon', 'gel', 'Lemon & Lime', 56, 'g', 104, 26, 13, 0, 0, 50, null, 'Natural energy gel'),
  ('Energy Gel', 'energy-gel-blackcurrant', 'gel', 'Blackcurrant', 56, 'g', 104, 26, 13, 0, 0, 50, null, 'Natural energy gel'),
  ('Energy Gel', 'energy-gel-apple', 'gel', 'Apple', 56, 'g', 104, 26, 13, 0, 0, 50, null, 'Natural energy gel'),
  ('Energy Gel', 'energy-gel-orange', 'gel', 'Orange', 56, 'g', 104, 26, 13, 0, 0, 50, null, 'Natural energy gel'),
  ('Energy Gel Caffeine', 'energy-gel-caffeine-cola', 'gel', 'Cola', 56, 'g', 104, 26, 13, 0, 0, 50, 50, 'With 50mg caffeine'),
  ('Super Gel', 'super-gel-lemon', 'gel', 'Lemon & Lime', 66, 'g', 160, 40, 20, 0, 0, 100, null, 'High carb gel'),
  ('Energy Bar', 'energy-bar-cocoa', 'bar', 'Cocoa & Coconut', 62, 'g', 243, 36, 18, 5, 8, 50, null, 'Natural energy bar'),
  ('Energy Bar', 'energy-bar-cherry', 'bar', 'Cherry & Almond', 62, 'g', 243, 36, 18, 5, 8, 50, null, 'Natural energy bar'),
  ('Energy Drink', 'energy-drink-lemon', 'drink_mix', 'Lemon & Lime', 43, 'g', 162, 40, 20, 0, 0, 200, null, 'Isotonic drink'),
  ('Energy Drink', 'energy-drink-blackcurrant', 'drink_mix', 'Blackcurrant', 43, 'g', 162, 40, 20, 0, 0, 200, null, 'Isotonic drink'),
  ('Hydro Tab', 'hydro-tab-lemon', 'chew', 'Lemon', 4, 'g', 8, 2, 0, 0, 0, 250, null, 'Zero calorie electrolyte'),
  ('Hydro Tab', 'hydro-tab-berry', 'chew', 'Berry', 4, 'g', 8, 2, 0, 0, 0, 250, null, 'Zero calorie electrolyte')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'ote-sports'
on conflict (brand_id, slug) do nothing;

-- Huma Gel Products
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Chia Energy Gel', 'chia-gel-strawberry', 'gel', 'Strawberries', 39, 'g', 100, 22, 12, 1, 1, 50, null, 'Chia-based gel'),
  ('Chia Energy Gel', 'chia-gel-mango', 'gel', 'Mangoes', 39, 'g', 100, 22, 12, 1, 1, 50, null, 'Chia-based gel'),
  ('Chia Energy Gel', 'chia-gel-apple', 'gel', 'Apples & Cinnamon', 39, 'g', 100, 22, 12, 1, 1, 50, null, 'Chia-based gel'),
  ('Chia Energy Gel', 'chia-gel-lemonade', 'gel', 'Lemonade', 39, 'g', 100, 22, 12, 1, 1, 50, null, 'Chia-based gel'),
  ('Chia Energy Gel', 'chia-gel-blueberry', 'gel', 'Blueberries', 39, 'g', 100, 22, 12, 1, 1, 50, null, 'Chia-based gel'),
  ('Chia Energy Gel Plus', 'chia-gel-plus-chocolate', 'gel', 'Chocolate', 39, 'g', 100, 22, 12, 1, 1, 50, 25, 'With caffeine'),
  ('Chia Energy Gel Plus', 'chia-gel-plus-espresso', 'gel', 'Espresso', 39, 'g', 100, 22, 12, 1, 1, 50, 50, 'With caffeine')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'huma-gel'
on conflict (brand_id, slug) do nothing;

-- Spring Energy Products
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Awesome Sauce', 'awesome-sauce', 'gel', 'Rice & Apple', 56, 'g', 180, 45, 18, 1, 0, 50, null, 'Real food gel'),
  ('Speednut', 'speednut', 'gel', 'Peanut Butter & Banana', 56, 'g', 190, 35, 12, 4, 5, 50, null, 'Real food gel with protein'),
  ('Koffee', 'koffee', 'gel', 'Coffee & Rice', 56, 'g', 180, 45, 18, 1, 0, 50, 65, 'With caffeine'),
  ('Hill Aid', 'hill-aid', 'gel', 'Banana & Honey', 56, 'g', 180, 45, 18, 1, 0, 50, null, 'Real food gel'),
  ('Long Haul', 'long-haul', 'gel', 'Sweet Potato & Coconut', 72, 'g', 250, 58, 22, 2, 2, 100, null, 'High calorie gel'),
  ('Canberry', 'canberry', 'gel', 'Cranberry & Rice', 56, 'g', 180, 45, 18, 1, 0, 50, null, 'Real food gel'),
  ('Canaberry + Caffeine', 'canberry-caffeine', 'gel', 'Cranberry & Rice', 56, 'g', 180, 45, 18, 1, 0, 50, 65, 'With caffeine')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'spring-energy'
on conflict (brand_id, slug) do nothing;

-- UnTapped Products
insert into public.products (brand_id, name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
select b.id, p.name, p.slug, p.form::product_form, p.flavor, p.serving_size, p.serving_unit, p.calories, p.carbs_g, p.sugar_g, p.protein_g, p.fat_g, p.sodium_mg, p.caffeine_mg, p.notes
from public.brands b
cross join (values
  ('Maple Syrup Gel', 'maple-gel-original', 'gel', 'Original Maple', 28, 'g', 100, 24, 20, 0, 0, 5, null, 'Pure maple syrup'),
  ('Maple Syrup Gel', 'maple-gel-salted', 'gel', 'Salted Maple', 28, 'g', 100, 24, 20, 0, 0, 100, null, 'With sea salt'),
  ('Maple Syrup Gel', 'maple-gel-coffee', 'gel', 'Coffee Infused', 28, 'g', 100, 24, 20, 0, 0, 5, 30, 'With caffeine'),
  ('Maple Syrup Gel', 'maple-gel-ginger', 'gel', 'Ginger Infused', 28, 'g', 100, 24, 20, 0, 0, 5, null, 'With ginger'),
  ('Maple Syrup Gel', 'maple-gel-raspberry', 'gel', 'Raspberry Infused', 28, 'g', 100, 24, 20, 0, 0, 5, null, 'With raspberry'),
  ('Mapleaid', 'mapleaid-lemon', 'drink_mix', 'Lemon', 25, 'g', 80, 20, 16, 0, 0, 200, null, 'Maple-based drink'),
  ('Mapleaid', 'mapleaid-ginger', 'drink_mix', 'Ginger', 25, 'g', 80, 20, 16, 0, 0, 200, null, 'Maple-based drink'),
  ('Waffle', 'waffle-original', 'solid', 'Original Maple', 30, 'g', 140, 22, 10, 2, 5, 50, null, 'Maple waffle'),
  ('Waffle', 'waffle-coffee', 'solid', 'Coffee', 30, 'g', 140, 22, 10, 2, 5, 50, 30, 'With caffeine')
) as p(name, slug, form, flavor, serving_size, serving_unit, calories, carbs_g, sugar_g, protein_g, fat_g, sodium_mg, caffeine_mg, notes)
where b.slug = 'untapped'
on conflict (brand_id, slug) do nothing;
