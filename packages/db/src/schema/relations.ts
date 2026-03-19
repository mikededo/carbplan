import { relations } from 'drizzle-orm'

import { athletes, coachingRelationships } from './athletes'
import { accounts, sessions, users } from './auth'
import { brands, favoriteBrands, favoriteProducts, products } from './catalog'
import { nutritionPlans, planGroups, planItems } from './plans'
import { workouts } from './workouts'

export const userRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  athlete: one(athletes, {
    fields: [users.id],
    references: [athletes.id]
  }),
  sessions: many(sessions)
}))

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id]
  })
}))

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}))

export const athleteRelations = relations(athletes, ({ many, one }) => ({
  coachedAthletes: many(coachingRelationships, { relationName: 'coach' }),
  coachingEntries: many(coachingRelationships, { relationName: 'athlete' }),
  favoriteBrands: many(favoriteBrands),
  favoriteProducts: many(favoriteProducts),
  nutritionPlans: many(nutritionPlans),
  user: one(users, {
    fields: [athletes.id],
    references: [users.id]
  }),
  workouts: many(workouts)
}))

export const coachingRelationshipRelations = relations(coachingRelationships, ({ one }) => ({
  athlete: one(athletes, {
    fields: [coachingRelationships.athleteId],
    references: [athletes.id],
    relationName: 'athlete'
  }),
  coach: one(athletes, {
    fields: [coachingRelationships.coachId],
    references: [athletes.id],
    relationName: 'coach'
  })
}))

export const brandRelations = relations(brands, ({ many }) => ({
  favoriteBrands: many(favoriteBrands),
  products: many(products)
}))

export const productRelations = relations(products, ({ many, one }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id]
  }),
  favoriteProducts: many(favoriteProducts),
  planItems: many(planItems)
}))

export const favoriteBrandRelations = relations(favoriteBrands, ({ one }) => ({
  athlete: one(athletes, {
    fields: [favoriteBrands.athleteId],
    references: [athletes.id]
  }),
  brand: one(brands, {
    fields: [favoriteBrands.brandId],
    references: [brands.id]
  })
}))

export const favoriteProductRelations = relations(favoriteProducts, ({ one }) => ({
  athlete: one(athletes, {
    fields: [favoriteProducts.athleteId],
    references: [athletes.id]
  }),
  product: one(products, {
    fields: [favoriteProducts.productId],
    references: [products.id]
  })
}))

export const workoutRelations = relations(workouts, ({ many, one }) => ({
  athlete: one(athletes, {
    fields: [workouts.athleteId],
    references: [athletes.id]
  }),
  plans: many(nutritionPlans)
}))

export const nutritionPlanRelations = relations(nutritionPlans, ({ many, one }) => ({
  athlete: one(athletes, {
    fields: [nutritionPlans.athleteId],
    references: [athletes.id]
  }),
  groups: many(planGroups),
  items: many(planItems),
  workout: one(workouts, {
    fields: [nutritionPlans.workoutId],
    references: [workouts.id]
  })
}))

export const planGroupRelations = relations(planGroups, ({ many, one }) => ({
  items: many(planItems),
  plan: one(nutritionPlans, {
    fields: [planGroups.planId],
    references: [nutritionPlans.id]
  })
}))

export const planItemRelations = relations(planItems, ({ one }) => ({
  group: one(planGroups, {
    fields: [planItems.groupId],
    references: [planGroups.id]
  }),
  plan: one(nutritionPlans, {
    fields: [planItems.planId],
    references: [nutritionPlans.id]
  }),
  product: one(products, {
    fields: [planItems.productId],
    references: [products.id]
  })
}))
