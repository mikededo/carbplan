# @carbplan/vitest-neverthrow

Neverthrow matchers for Vitest via `expect.extend`.

## Matchers

- `toBeOk`
- `toBeErr`
- `toBeOkWith(expected)`
- `toBeErrWith(expected)`
- `toBeOkAsync`
- `toBeErrAsync`
- `toBeOkAsyncWith(expected)`
- `toBeErrAsyncWith(expected)`

## Usage

Create a test setup file:

```ts
import { expect } from 'vitest'
import { neverthrowMatchers } from '@carbplan/vitest-neverthrow'

expect.extend(neverthrowMatchers)
```
