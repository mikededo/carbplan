import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { athletes, brands, coachingRelationships, favoriteBrands, favoriteProducts, nutritionPlans, planGroups, planItems, products, workouts } from './schema'

export type Athlete = InferSelectModel<typeof athletes>
export type NewAthlete = InferInsertModel<typeof athletes>

export type CoachingRelationship = InferSelectModel<typeof coachingRelationships>
export type NewCoachingRelationship = InferInsertModel<typeof coachingRelationships>

export type Brand = InferSelectModel<typeof brands>
export type NewBrand = InferInsertModel<typeof brands>

export type Product = InferSelectModel<typeof products>
export type NewProduct = InferInsertModel<typeof products>

export type FavoriteBrand = InferSelectModel<typeof favoriteBrands>
export type NewFavoriteBrand = InferInsertModel<typeof favoriteBrands>

export type FavoriteProduct = InferSelectModel<typeof favoriteProducts>
export type NewFavoriteProduct = InferInsertModel<typeof favoriteProducts>

export type NutritionPlan = InferSelectModel<typeof nutritionPlans>
export type NewNutritionPlan = InferInsertModel<typeof nutritionPlans>

export type PlanGroup = InferSelectModel<typeof planGroups>
export type NewPlanGroup = InferInsertModel<typeof planGroups>

export type PlanItem = InferSelectModel<typeof planItems>
export type NewPlanItem = InferInsertModel<typeof planItems>

export type Workout = InferSelectModel<typeof workouts>
export type NewWorkout = InferInsertModel<typeof workouts>
