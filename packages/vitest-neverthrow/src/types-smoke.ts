import { ok, ResultAsync } from 'neverthrow'
import { expect } from 'vitest'

import { registerNeverthrowMatchers } from './matchers'

registerNeverthrowMatchers()

expect(ok(1)).$ok.toEqual(1)
expect(ok(new Error('x'))).$ok.toBeInstanceOf(Error)
void expect(ResultAsync.fromSafePromise(Promise.resolve(1))).$okAsync.toEqual(1)
