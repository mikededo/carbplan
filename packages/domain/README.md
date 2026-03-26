# @carbplan/domain

Shared domain primitives used across layers (`db`, `api`, `web`, and `contracts`).

This package is the source of truth for values that represent domain meaning and must stay consistent everywhere:

- enum values (for example `SEX_VALUES`)
- shared numeric/range constraints (for example `PROFILE_FIELD_CONSTRAINTS`)
- framework-agnostic domain types

## Why this package exists

Some values are not just API concerns or DB concerns. They are domain concerns.
When those values are duplicated by layer, drift appears quickly.

`@carbplan/domain` keeps those values in one place while preserving clean dependency direction:

- `contracts` depends on `domain`
- `db` depends on `domain`
- `web` depends on `domain`
- `domain` depends on no app or infra package

## Usage

```ts
import { PROFILE_FIELD_CONSTRAINTS, SEX_VALUES } from '@carbplan/domain/profile'
```

### Contracts schema

```ts
import { PROFILE_FIELD_CONSTRAINTS, SEX_VALUES } from '@carbplan/domain/profile'
import * as z from 'zod'

const SexSchema = z.enum(SEX_VALUES)
```

### DB enum

```ts
import { SEX_VALUES } from '@carbplan/domain/profile'
import { pgEnum } from 'drizzle-orm/pg-core'

const sexEnum = pgEnum('sex', [...SEX_VALUES] as [string, ...string[]])
```

## Rules

1. Keep this package framework-agnostic whenever possible.
2. Do not place UI copy or DB-specific implementation details here.
3. If changing a value could affect multiple layers, change it here first.
