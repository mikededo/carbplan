import { createSchemaFactory } from 'drizzle-typebox'
import { t } from 'elysia'

const schemaFactory = createSchemaFactory({ typeboxInstance: t })

export const createInsertModel = schemaFactory.createInsertSchema
export const createSelectModel = schemaFactory.createSelectSchema
export const createUpdateModel = schemaFactory.createUpdateSchema

