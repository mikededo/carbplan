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

> Async matchers require receiving a `ResultAsync`, and the test case must be
> declared `async`, without awaiting for the response

## Usage

Create a test setup file:

```ts
import { neverthrowMatchers } from '@carbplan/vitest-neverthrow'
import { expect } from 'vitest'

expect.extend(neverthrowMatchers)
```
