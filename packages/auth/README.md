# @carbplan/auth

Shared authentication module for CarbPlan.

This package centralizes Better Auth configuration and helpers so auth behavior is defined once and reused across apps.

## What this package owns

- Better Auth server construction through `createAuthServer`.
- Better Auth client construction through `createAuthClient`.
- Auth configuration loading and normalization through `loadAuthConfig`.
- Request session helper through `getRequestSession`.

## What this package does not own

- Database connection lifecycle.
- HTTP route hosting.
- App-specific env loading strategy.

`apps/api` should create the DB and mount endpoints. `apps/web` should call auth over HTTP.

## Why this exists

If auth lived only inside endpoint code, each app could drift in:

- Better Auth options (`basePath`, trusted origins, secret usage).
- DB adapter wiring.
- Session helper shapes.
- Domain provisioning hooks.

Keeping auth logic in this package gives a single source of truth while still letting backend apps host routes.

## Server usage 

```ts
import { createAuthServer, loadAuthConfig } from '@carbplan/auth'
import { createDb } from '@carbplan/db'

const { db } = createDb(process.env.DATABASE_URL!)

const authConfig = loadAuthConfig({
  authBaseUrl: process.env.AUTH_BASE_URL,
  authSecret: process.env.BETTER_AUTH_SECRET,
  authTrustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS
})

const authServer = createAuthServer({
  basePath: '/auth',
  baseURL: authConfig.baseURL,
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // consumer-owned domain provisioning
        }
      }
    }
  },
  db,
  secret: authConfig.secret,
  trustedOrigins: authConfig.trustedOrigins
})

// mount authServer.handler under /auth/* in the API app
```

## Client usage 

```ts
import { createAuthClient } from '@carbplan/auth'

export const authClient = createAuthClient({
  basePath: '/api/auth'
})
```

`/api/auth` can be a same-origin proxy to the API server (`/auth`) so session cookies remain first-party.

## Database boundary

This package performs Better Auth persistence using the injected `db` instance.

That is intentional and not an architectural problem because:

- DB ownership remains in `@carbplan/db` (schema/migrations/connection creation).
- Host apps pass the DB into this package.
- This package does not open its own DB connection.
- Domain provisioning (for example upserting `athletes`) should be implemented by consumers through `databaseHooks`.

## Required runtime config

- `BETTER_AUTH_SECRET`
- `AUTH_BASE_URL`
- Optional: `BETTER_AUTH_TRUSTED_ORIGINS` as comma-separated origins.

`loadAuthConfig` validates and normalizes these values.

## Tests

Run package tests from repo root:

```sh
bun --cwd packages/auth test
```

The test suite currently covers config validation and trusted-origin normalization.
