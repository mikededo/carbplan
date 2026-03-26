import './setup'
import { err, ok, ResultAsync } from 'neverthrow'
import { describe, expect, it } from 'vitest'

describe('sync matchers', () => {
  it('$ok unwraps Ok values', () => {
    expect(ok({ value: 1 })).$ok.toEqual({ value: 1 })
  })

  it('$err unwraps Err values', () => {
    expect(err(new Error('oops'))).$err.toBeInstanceOf(Error)
  })

  it('throws when using $ok on Err', () => {
    expect(() => expect(err('x')).$ok).toThrowError(/to be Ok/)
  })

  it('throws when using $err on Ok', () => {
    expect(() => expect(ok('x')).$err).toThrowError(/to be Err/)
  })
})

describe('async matchers', () => {
  it('$okAsync unwraps ResultAsync Ok values', async () => {
    const result = ResultAsync.fromSafePromise(Promise.resolve({ value: 2 }))
    await expect(result).$okAsync.toEqual({ value: 2 })
  })

  it('$errAsync unwraps ResultAsync Err values', async () => {
    const parse = ResultAsync.fromThrowable((value: string) => JSON.parse(value))
    await expect(parse('invalid')).$errAsync.toBeInstanceOf(SyntaxError)
  })

  it('throws for non-ResultAsync with $okAsync', () => {
    expect(() => (expect(1) as unknown as { $okAsync: unknown }).$okAsync).toThrowError(/ResultAsync/)
  })

  it('throws for non-ResultAsync with $errAsync', () => {
    expect(() => (expect(1) as unknown as { $errAsync: unknown }).$errAsync).toThrowError(/ResultAsync/)
  })
})
