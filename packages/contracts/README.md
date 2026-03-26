# @carbplan/contracts

This package defines the **public wire contracts** used between clients and backend services.
It is intentionally independent from DB schema details.

## Why this package exists

Without a shared contract source, API and frontend can drift:

- API changes payload shape silently
- frontend compiles but fails at runtime
- error payloads become inconsistent across routes

This package solves that by making contract schemas and types explicit, versioned in one place.

## Architecture

The system is split into 3 layers:

1. Persistence (`@carbplan/db`)
- Owns database schema, migrations, and DB-level types.
- Used by repositories/services inside backend.

2. Contracts (`@carbplan/contracts`)
- Owns request/response envelopes and endpoint DTOs.
- Uses zod for runtime validation + static inference.
- Does **not** depend on DB internals.

3. HTTP/API and clients
- API maps internal domain/DB objects to contract DTOs before returning.
- Client validates transport payloads against contract schemas.

This keeps persistence concerns and wire concerns decoupled.

### Intended architecture (ASCII)

```
                  +----------------------------+
                  |       Client Apps          |
                  +-------------+--------------+
                                |
                  validate I/O with shared schemas
                                |
                                v
                  +----------------------------+
                  |  @carbplan/contracts       |
                  |    - zod request schemas   |
                  |    - zod response schemas  |
                  |    - ApiSuccess / ApiError |
                  +-------------+--------------+
                                ^
                API returns DTO | parses/validates at boundary
                                |
                  +-------------+--------------+
                  |        @carbplan/api       |
                  |  HTTP handlers + mapping   |
                  |  internal -> contract DTO  |
                  +-------------+--------------+
                                |
                  internal persistence models only
                                |
                                v
                  +----------------------------+
                  |        @carbplan/db        |
                  | Drizzle schema + migrations|
                  | DB row / relation models   |
                  +----------------------------+
```

## Design rules

1. Contracts are endpoint-facing, not DB-facing.
2. If a field only exists because of DB representation, do not expose it unless it is API-relevant.
3. Keep naming stable and domain language-focused.
4. Prefer additive changes over breaking shape changes.
5. Validate payloads at boundaries (API output and client input).

## Using with Elysia TypeBox

Use a strict split of responsibilities:

- `@carbplan/contracts` (zod) is the source of truth for wire contracts.
- Elysia `t`/TypeBox is an adapter layer for route metadata and OpenAPI.

Recommended flow:

1. Define request/response schemas in `@carbplan/contracts` (zod).
2. Parse/validate payloads with zod in handlers.
3. Convert zod schema to Elysia model for `response` docs.

Example adapter in API:

```ts
import { t } from 'elysia'
import * as z from 'zod'

export const toApiModel = <T extends z.ZodType>(schema: T) =>
  t.Unsafe<z.infer<T>>(z.toJSONSchema(schema) as Record<string, unknown>)
```

Example usage in a route:

```ts
import { authContracts } from '@carbplan/contracts'

use(
  '',
  () => {},
  {
    response: { 200: toApiModel(authContracts.GetSessionResponseSchema) }
  }
)
```

Important rule:

- Do not model the same business DTO twice (once in zod and again in TypeBox).
- Keep TypeBox usage thin and derivative from zod contracts.

## Example (athlete-focused)

### 1) Define a new athlete endpoint contract

```ts
// src/domains/athlete.ts
import * as z from 'zod'

import { ApiSuccessSchema } from '../api'

export const UpdateAthleteProfileRequestSchema = z.object({
  ftp: z.int().positive().optional(),
  fullName: z.string().trim().min(1).optional(),
  weightKg: z.number().positive().optional()
})

export const AthleteProfileSchema = z.object({
  ftp: z.int().nullable(),
  fullName: z.string().trim().nullable(),
  id: z.uuid(),
  weightKg: z.number().nullable()
})

export const UpdateAthleteProfileResponseSchema = ApiSuccessSchema(z.object({
  athlete: AthleteProfileSchema
}))

export type UpdateAthleteProfileRequest = z.infer<typeof UpdateAthleteProfileRequestSchema>
export type UpdateAthleteProfileResponse = z.infer<typeof UpdateAthleteProfileResponseSchema>
```

### 2) API route uses the contract

```ts
import { athleteContracts } from '@carbplan/contracts'

const input = athleteContracts.UpdateAthleteProfileRequestSchema.parse(body)

const response = {
  data: {
    athlete: {
      ftp: input.ftp ?? 265,
      fullName: input.fullName ?? 'Jane Rider',
      id: uuid(),
      weightKg: input.weightKg ?? 63.5
    }
  }
}

return athleteContracts.UpdateAthleteProfileResponseSchema.parse(response)
```

### 3) Client validates response with same contract

```ts
import { athleteContracts } from '@carbplan/contracts'

const payload = await fetch('/api/v1/athletes/me', {
  body: JSON.stringify({ ftp: 280 }),
  method: 'PATCH'
}).then((r) => r.json())

const parsed = athleteContracts.UpdateAthleteProfileResponseSchema.parse(payload)

console.log(parsed.data.athlete.ftp)
```

## Versioning and change policy

When changing contract schemas:

- Update/add tests under `tests/`
- Treat breaking changes as coordinated changes across API + clients
- Prefer adding optional fields before removing/renaming existing ones
