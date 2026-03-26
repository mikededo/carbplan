import { Err, Ok, ResultAsync } from 'neverthrow'
import { expect } from 'vitest'

type MatcherResult = {
  message: () => string
  pass: boolean
}

type MatcherContext = {
  equals: (actual: unknown, expected: unknown) => boolean
  utils: {
    printExpected: (value: unknown) => string
    printReceived: (value: unknown) => string
  }
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
  interface Matchers<T = any> extends NeverthrowMatchers<T> {}
}

const isOkResult = (value: unknown): value is Ok<unknown, unknown> => value instanceof Ok
const isErrResult = (value: unknown): value is Err<unknown, unknown> => value instanceof Err
const isResult = (value: unknown): value is Err<unknown, unknown> | Ok<unknown, unknown> => (
  isOkResult(value) || isErrResult(value)
)

const ensureResult = (value: unknown, matcherName: string) => {
  if (isResult(value)) {
    return
  }

  throw new TypeError(`You must provide a Result to expect() when using .${matcherName}.`)
}

const ensureResultAsync = (value: unknown, matcherName: string): ResultAsync<unknown, unknown> => {
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
) => {
  if (isConstructor(expected) && typeof actual === 'object' && actual !== null) {
    return actual instanceof expected
  }

  return equals(actual, expected)
}

const passMessage = (matcher: string, expected: string, received: string) =>
  `expected ${received} not to ${matcher}${expected.length > 0 ? ` ${expected}` : ''}`

const failMessage = (matcher: string, expected: string, received: string) =>
  `expected ${received} to ${matcher}${expected.length > 0 ? ` ${expected}` : ''}`

export const neverthrowMatchers = {
  toBeOk(this: MatcherContext, received: unknown): MatcherResult {
    ensureResult(received, 'toBeOk')
    const pass = isOkResult(received)

    return {
      message: () => (pass
        ? passMessage('be Ok', '', this.utils.printReceived(received))
        : failMessage('be Ok', '', this.utils.printReceived(received))),
      pass
    }
  },

  toBeErr(this: MatcherContext, received: unknown): MatcherResult {
    ensureResult(received, 'toBeErr')
    const pass = isErrResult(received)

    return {
      message: () => (pass
        ? passMessage('be Err', '', this.utils.printReceived(received))
        : failMessage('be Err', '', this.utils.printReceived(received))),
      pass
    }
  },

  toBeOkWith(this: MatcherContext, received: unknown, expected: unknown): MatcherResult {
    ensureResult(received, 'toBeOkWith')
    const pass = isOkResult(received) && matchesExpected(this.equals, received.value, expected)

    return {
      message: () => {
        if (!isOkResult(received)) {
          return failMessage('be Ok with', this.utils.printExpected(expected), this.utils.printReceived(received))
        }

        return pass
          ? passMessage('be Ok with', this.utils.printExpected(expected), this.utils.printReceived(received.value))
          : failMessage('be Ok with', this.utils.printExpected(expected), this.utils.printReceived(received.value))
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
          return failMessage('be Err with', this.utils.printExpected(expected), this.utils.printReceived(received))
        }

        return pass
          ? passMessage('be Err with', this.utils.printExpected(expected), this.utils.printReceived(received.error))
          : failMessage('be Err with', this.utils.printExpected(expected), this.utils.printReceived(received.error))
      },
      pass
    }
  },

  async toBeOkAsync(this: MatcherContext, received: unknown): Promise<MatcherResult> {
    const resultAsync = ensureResultAsync(received, 'toBeOkAsync')
    const resolved = await resultAsync
    const pass = isOkResult(resolved)

    return {
      message: () => (pass
        ? passMessage('be Ok', '', this.utils.printReceived(resolved))
        : failMessage('be Ok', '', this.utils.printReceived(resolved))),
      pass
    }
  },

  async toBeErrAsync(this: MatcherContext, received: unknown): Promise<MatcherResult> {
    const resultAsync = ensureResultAsync(received, 'toBeErrAsync')
    const resolved = await resultAsync
    const pass = isErrResult(resolved)

    return {
      message: () => (pass
        ? passMessage('be Err', '', this.utils.printReceived(resolved))
        : failMessage('be Err', '', this.utils.printReceived(resolved))),
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
          return failMessage('be Ok with', this.utils.printExpected(expected), this.utils.printReceived(resolved))
        }

        return pass
          ? passMessage('be Ok with', this.utils.printExpected(expected), this.utils.printReceived(resolved.value))
          : failMessage('be Ok with', this.utils.printExpected(expected), this.utils.printReceived(resolved.value))
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
          return failMessage('be Err with', this.utils.printExpected(expected), this.utils.printReceived(resolved))
        }

        return pass
          ? passMessage('be Err with', this.utils.printExpected(expected), this.utils.printReceived(resolved.error))
          : failMessage('be Err with', this.utils.printExpected(expected), this.utils.printReceived(resolved.error))
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
