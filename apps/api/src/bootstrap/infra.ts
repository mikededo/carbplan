import type { Db } from '@carbplan/db'

import { createDb } from '@carbplan/db'

export type Infra = {
  db: Db
}

type CreateInfraOptions = {
  databaseUrl: string
}

export const createInfra = ({ databaseUrl }: CreateInfraOptions): Infra => {
  const { db } = createDb(databaseUrl)
  return { db }
}
