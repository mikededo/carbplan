import { err, ok, ResultAsync } from 'neverthrow'

import { registerNeverthrowMatchers } from './matchers'

registerNeverthrowMatchers()

expect(ok(1)).toBeOk()
expect(ok({ value: 1 })).toBeOkWith({ value: 1 })
expect(err('x')).toBeErrWith('x')
void expect(ResultAsync.fromSafePromise(Promise.resolve(1))).toBeOkAsyncWith(1)
