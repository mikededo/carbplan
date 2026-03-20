# Carbplan Backend API Standard (v2)

## Purpose and Scope

This document is the source of truth for backend API contract rules in Carbplan.

It defines:

- API behavior expected by clients
- architecture constraints for implementation
- testing and OpenAPI requirements for each endpoint

It does not contain delivery roadmap or feature priority plans.

## Runtime and Delivery Model

- Runtime: Elysia modular monolith
- API style: REST + OpenAPI
- Architecture style: DDD with explicit boundaries
- Delivery style: TDD (`red -> green -> refactor`)

## DDD Architecture Rules

### Layering contract

Dependency direction is fixed:

`HTTP (Elysia handlers) -> Application (use cases) -> Domain (rules)`

Infrastructure adapters implement application ports and stay at the edge.

### Layer responsibilities

- `HTTP`
  - Route definitions
  - Request/response validation
  - Auth guard wiring
  - Mapping application/domain errors to HTTP status codes
- `Application`
  - Use-case orchestration
  - Port usage
  - Transaction boundaries
  - Authorization checks that require business context
- `Domain`
  - Invariants, business rules, value objects, domain errors
- `Infrastructure`
  - Drizzle queries/commands
  - Mapping persistence records to app/domain types

### Forbidden patterns

- DB calls in handlers
- Business rules inside infra adapters
- Domain logic in bootstrap files
- Cross-context coupling through concrete adapter imports

## Internal Contracts (Ports and Use Cases)

Ports are application-facing interfaces, not framework-specific implementations.

```ts
export interface QueryPort<TQuery, TResult> {
  execute(query: TQuery): Promise<TResult>
}

export interface CommandPort<TCommand, TResult = void> {
  execute(command: TCommand): Promise<TResult>
}

export interface ActorContextPort {
  getActorId(input: { request: Request }): Promise<null | string>
}
```

Rule: HTTP handlers depend on use-case interfaces only.

## API Contract (Normative)

### Request conventions

- Path params identify resources (`:id`)
- Query params are for filtering, sorting, and pagination
- Body is for write intent only
- All inputs must be validated at the HTTP boundary

### Response envelope

All new routes must return this success shape:

```ts
type ApiSuccess<T> = {
  data: T
  meta?: {
    requestId?: string
    nextCursor?: string
  }
}
```

Legacy routes may keep existing payload shape only as explicit exceptions documented in route-level notes.

### Error payload

All new routes must return this error shape:

```ts
type ApiError = {
  code: string
  message: string
  requestId: string
  details?: Record<string, unknown>
}
```

Error `code` values must be stable and machine-readable. Use uppercase snake case with domain prefix:

- `AUTH_UNAUTHENTICATED`
- `AUTH_FORBIDDEN`
- `RESOURCE_NOT_FOUND`
- `DOMAIN_CONFLICT`
- `VALIDATION_FAILED`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

### HTTP status mapping

Use this mapping for new routes:

- `400` validation errors (`VALIDATION_FAILED`)
- `401` unauthenticated (`AUTH_UNAUTHENTICATED`)
- `403` authenticated but not allowed (`AUTH_FORBIDDEN`)
- `404` entity not found (`RESOURCE_NOT_FOUND`)
- `409` domain conflict (`DOMAIN_CONFLICT`)
- `429` rate limited, only when policy applies (`RATE_LIMITED`)
- `500` unexpected failure (`INTERNAL_ERROR`)

## Query, Pagination, and Time Conventions

- Pagination:
  - `limit` (integer, bounded)
  - `cursor` (opaque string)
- Sorting:
  - `sort` as `field:direction`, where direction is `asc` or `desc`
- Filtering:
  - Explicit query params per route (for example, `status=active`)
  - Do not accept arbitrary unbounded filter expressions
- Time:
  - All timestamps are ISO 8601 UTC strings

## Idempotency and Headers

For non-idempotent write endpoints (`POST`), support idempotency with header `Idempotency-Key`.

- Same actor + same key + same payload: return same effective result
- Same actor + same key + different payload: return `409` (`DOMAIN_CONFLICT`)

Correlation:

- Every response should include `requestId` in success `meta` or error payload
- HTTP layer is responsible for assigning/propagating request ID

## Security and Authorization Contract

- `401` when actor cannot be resolved or auth token is invalid
- `403` when actor exists but lacks required permission
- Authorization checks that depend on business state belong in use cases, not only in HTTP guards
- Sensitive mutations should emit audit events with actor ID, target ID, action, and timestamp

## Endpoint Template

```ts
app.post('/v1/resource/:id/action', async ({ params, query, body, request, status }) => {
  // 1) Resolve actor
  // 2) Validate params/query/body
  // 3) Invoke use case through application interface
  // 4) Map known errors to status + ApiError
  // 5) Return ApiSuccess<T>
}, {
  // OpenAPI request/response schemas
})
```

Checklist for every new endpoint:

1. Request and response schemas are defined and exported
2. Handler does not perform direct DB access
3. Use case is called via application interface
4. Error mapping follows the standard table
5. OpenAPI includes success and error variants
6. Request ID and auth behavior are covered in tests

## TDD Protocol (Mandatory)

### Red -> Green -> Refactor

For every use case:

1. Write failing tests first
2. Implement minimal passing code
3. Refactor while keeping tests green

### Required test layers

- `Domain tests`
  - Invariants and rule outcomes
  - No DB, no HTTP
- `Application tests`
  - Use-case orchestration with fakes
  - Success, failure, authorization, and idempotency behavior
- `HTTP contract tests`
  - Status codes
  - Success/error schema shape
  - Authn/authz behavior (`401` vs `403`)
  - Pagination/sort/filter parsing
  - Key headers (`Idempotency-Key`, request ID)

### Definition of done per feature

A feature is done only when:

1. Domain rules are covered by tests
2. Use case behavior is covered by tests
3. HTTP contract is covered by tests
4. OpenAPI reflects route contracts
5. Architecture rules in this standard are respected

## Migration and Exception Policy

- Existing routes may remain in legacy shape until explicitly migrated
- New routes must follow this v2 standard
- Any exception must be documented with:
  - reason
  - owner
  - expiry condition

## Practical Notes

- Prefer small vertical slices over wide refactors
- Keep naming ubiquitous and domain-driven
- Update this standard when contract-level decisions change
