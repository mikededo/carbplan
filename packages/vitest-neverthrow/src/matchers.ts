import { Err, Ok, ResultAsync } from 'neverthrow'
import { expect } from 'vitest'

type MatcherResult = {
  message: () => string
  pass: boolean
}

type MatcherUtils = {
  printExpected: (value: unknown) => string
  printReceived: (value: unknown) => string
  diff: (expected: unknown, received: unknown) => string | undefined
}

type MatcherContext = {
  equals: (actual: unknown, expected: unknown) => boolean
  utils: MatcherUtils
}

type NeverthrowMatchers<R = unknown> = {
  toBeOk: () => R
  toBeErr: () => R
  toBeOkWith: (expected: unknown) => R
  toBeErrWith: (expected: unknown) => R
  toBeOkAsync: () => Promise<R>
  toBeErrAsync: () => Promise<R>
  toBeOkAsyncWith: (expected: unknown) => Promise<R>
  toBeErrAsyncWith: (expected: unknown) => Promise<R>
}

declare module 'vitest' {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Matchers<T = any> extends NeverthrowMatchers<T> { }
}

const isOkResult = (value: unknown): value is Ok<unknown, unknown> => value instanceof Ok
const isErrResult = (value: unknown): value is Err<unknown, unknown> => value instanceof Err
const isResult = (value: unknown): value is Err<unknown, unknown> | Ok<unknown, unknown> => isOkResult(value) || isErrResult(value)

const ensureResult = (value: unknown, matcherName: string): void => {
  if (!isResult(value)) {
    throw new TypeError(
      `You must provide a Result to expect() when using .${matcherName}.`
    )
  }
}

const ensureResultAsync = (
  value: unknown,
  matcherName: string
): ResultAsync<unknown, unknown> => {
  if (value instanceof ResultAsync) {
    return value
  }

  throw new TypeError(`You must provide a ResultAsync to expect() when using .${matcherName}.`)
}

const isConstructor = (value: unknown): value is new (...args: never[]) => unknown => typeof value === 'function'

const matchesExpected = (
  equals: MatcherContext['equals'],
  actual: unknown,
  expected: unknown
): boolean => {
  if (isConstructor(expected) && typeof actual === 'object' && actual !== null) {
    return actual instanceof expected
  }
  return equals(actual, expected)
}

const passMsg = (variant: string, received: string) => `expected ${received} not to be ${variant}`
const failMsg = (variant: string, received: string) => `expected ${received} to be ${variant}`

const failMsgWith = (
  variant: string,
  expected: unknown,
  actual: unknown,
  utils: MatcherUtils
): string => {
  const diffOutput = utils.diff(expected, actual)
  const detail = diffOutput ?? `Expected: ${utils.printExpected(expected)}\nReceived: ${utils.printReceived(actual)}`
  return `expected value to be ${variant}:\n${detail}`
}

export const neverthrowMatchers = {
  toBeOk(this: MatcherContext, received: unknown): MatcherResult {
    ensureResult(received, 'toBeOk')
    const pass = isOkResult(received)
    const printed = this.utils.printReceived(received)
    return {
      message: () => pass ? passMsg('Ok', printed) : failMsg('Ok', printed),
      pass
    }
  },

  toBeErr(this: MatcherContext, received: unknown): MatcherResult {
    ensureResult(received, 'toBeErr')
    const pass = isErrResult(received)
    const printed = this.utils.printReceived(received)
    return {
      message: () => pass ? passMsg('Err', printed) : failMsg('Err', printed),
      pass
    }
  },

  toBeOkWith(this: MatcherContext, received: unknown, expected: unknown): MatcherResult {
    ensureResult(received, 'toBeOkWith')
    const pass = isOkResult(received) && matchesExpected(this.equals, received.value, expected)

    return {
      message: () => {
        if (!isOkResult(received)) {
          return failMsg('Ok', this.utils.printReceived(received))
        }
        return pass
          ? passMsg('Ok', this.utils.printReceived(received.value))
          : failMsgWith('Ok with', expected, received.value, this.utils)
      },
      pass
    }
  },

  toBeErrWith(this: MatcherContext, received: unknown, expected: unknown): MatcherResult {
    ensureResult(received, 'toBeErrWith')
    const pass = isErrResult(received) && matchesExpected(this.equals, received.error, expected)

    return {
      message: () => {
        if (!isErrResult(received)) {
          return failMsg('Err', this.utils.printReceived(received))
        }
        return pass
          ? passMsg('Err', this.utils.printReceived(received.error))
          : failMsgWith('Err with', expected, received.error, this.utils)
      },
      pass
    }
  },

  async toBeOkAsync(this: MatcherContext, received: unknown): Promise<MatcherResult> {
    const resultAsync = ensureResultAsync(received, 'toBeOkAsync')
    const resolved = await resultAsync
    const pass = isOkResult(resolved)
    const printed = this.utils.printReceived(resolved)
    return {
      message: () => pass ? passMsg('Ok', printed) : failMsg('Ok', printed),
      pass
    }
  },

  async toBeErrAsync(this: MatcherContext, received: unknown): Promise<MatcherResult> {
    const resultAsync = ensureResultAsync(received, 'toBeErrAsync')
    const resolved = await resultAsync
    const pass = isErrResult(resolved)
    const printed = this.utils.printReceived(resolved)
    return {
      message: () => pass ? passMsg('Err', printed) : failMsg('Err', printed),
      pass
    }
  },

  async toBeOkAsyncWith(
    this: MatcherContext,
    received: unknown,
    expected: unknown
  ): Promise<MatcherResult> {
    const resultAsync = ensureResultAsync(received, 'toBeOkAsyncWith')
    const resolved = await resultAsync
    const pass = isOkResult(resolved) && matchesExpected(this.equals, resolved.value, expected)

    return {
      message: () => {
        if (!isOkResult(resolved)) {
          return failMsg('Ok', this.utils.printReceived(resolved))
        }
        return pass
          ? passMsg('Ok', this.utils.printReceived(resolved.value))
          : failMsgWith('Ok with', expected, resolved.value, this.utils)
      },
      pass
    }
  },

  async toBeErrAsyncWith(
    this: MatcherContext,
    received: unknown,
    expected: unknown
  ): Promise<MatcherResult> {
    const resultAsync = ensureResultAsync(received, 'toBeErrAsyncWith')
    const resolved = await resultAsync
    const pass = isErrResult(resolved) && matchesExpected(this.equals, resolved.error, expected)

    return {
      message: () => {
        if (!isErrResult(resolved)) {
          return failMsg('Err', this.utils.printReceived(resolved))
        }
        return pass
          ? passMsg('Err', this.utils.printReceived(resolved.error))
          : failMsgWith('Err with', expected, resolved.error, this.utils)
      },
      pass
    }
  }
}

let didRegisterMatchers = false

export const registerNeverthrowMatchers = () => {
  if (didRegisterMatchers) {
    return
  }
  expect.extend(neverthrowMatchers)
  didRegisterMatchers = true
}
