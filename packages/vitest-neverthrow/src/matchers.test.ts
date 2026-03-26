import { err, ok, ResultAsync } from 'neverthrow'
import { describe, expect, it } from 'vitest'

import { registerNeverthrowMatchers } from './matchers'

registerNeverthrowMatchers()

describe('sync matchers', () => {
  it('toBeOk passes for Ok values', () => {
    expect(ok({ value: 1 })).toBeOk()
  })

  it('toBeErr passes for Err values', () => {
    expect(err(new Error('oops'))).toBeErr()
  })

  it('toBeOkWith matches Ok payload', () => {
    expect(ok({ value: 1 })).toBeOkWith({ value: 1 })
  })

  it('toBeErrWith matches Err payload', () => {
    expect(err('oops')).toBeErrWith('oops')
  })

  it('throws when using toBeOk on non-Result values', () => {
    expect(() => expect(1).toBeOk()).toThrow(/Result/)
  })
})

describe('async matchers', () => {
  it('toBeOkAsync passes for ResultAsync Ok values', async () => {
    const result = ResultAsync.fromSafePromise(Promise.resolve({ value: 2 }))
    await expect(result).toBeOkAsync()
  })

  it('toBeErrAsync passes for ResultAsync Err values', async () => {
    const parse = ResultAsync.fromThrowable((value: string) => JSON.parse(value))
    await expect(parse('invalid')).toBeErrAsync()
  })

  it('toBeOkAsyncWith matches ResultAsync Ok payload', async () => {
    const result = ResultAsync.fromSafePromise(Promise.resolve({ value: 2 }))
    await expect(result).toBeOkAsyncWith({ value: 2 })
  })

  it('toBeErrAsyncWith matches ResultAsync Err payload', async () => {
    const parse = ResultAsync.fromThrowable((value: string) => JSON.parse(value))
    await expect(parse('invalid')).toBeErrAsyncWith(expect.any(SyntaxError))
  })

  it('throws for non-ResultAsync with toBeOkAsync', async () => {
    await expect(expect(1).toBeOkAsync()).rejects.toThrowError(/ResultAsync/)
  })
})
