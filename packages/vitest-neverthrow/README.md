# @carbplan/vitest-neverthrow

Neverthrow matchers for Vitest with plugin-based setup.

## Matchers

- `$ok`: assert value is `Ok` and unwrap `value`
- `$err`: assert value is `Err` and unwrap `error`
- `$okAsync`: assert `ResultAsync` resolves to `Ok` and unwrap `value`
- `$errAsync`: assert `ResultAsync` resolves to `Err` and unwrap `error`

## Usage

### Vitest plugin

```ts
import { neverthrowPlugin } from '@carbplan/vitest-neverthrow'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [neverthrowPlugin()]
})
```

### Manual setup import

```ts
import '@carbplan/vitest-neverthrow/setup'
```
