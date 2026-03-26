import { Err, Ok, ResultAsync } from 'neverthrow'
import { chai } from 'vitest'

declare module 'vitest' {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Assertion<T = any> {
    $err: Assertion<T>
    $errAsync: Assertion<T>
    $ok: Assertion<T>
    $okAsync: Assertion<T>
  }
}

let didRegisterMatchers = false

const safeIsOk = (obj: unknown): obj is Ok<unknown, unknown> => obj instanceof Ok && obj.isOk()
const safeIsErr = (obj: unknown): obj is Err<unknown, unknown> => obj instanceof Err && obj.isErr()

export const registerNeverthrowMatchers = () => {
  if (didRegisterMatchers) {
    return
  }

  didRegisterMatchers = true

  chai.use((chaiInstance, utils) => {
    utils.addChainableMethod(
      chaiInstance.Assertion.prototype,
      '$ok',
      () => { },

      function assertOk(this: typeof chaiInstance.Assertion.prototype) {
        const obj = utils.flag(this, 'object')
        const isOk = safeIsOk(obj)

        this.assert(isOk, 'expected #{this} to be Ok', 'expected #{this} not to be Ok')

        if (!safeIsOk(obj)) {
          return this
        }

        utils.flag(this, 'object', obj.value)
        return this
      }
    )

    utils.addChainableMethod(
      chaiInstance.Assertion.prototype,
      '$err',
      () => { },

      function assertErr(this: typeof chaiInstance.Assertion.prototype) {
        const obj = utils.flag(this, 'object')
        const isErr = safeIsErr(obj)

        this.assert(isErr, 'expected #{this} to be Err', 'expected #{this} not to be Err')

        if (!safeIsErr(obj)) {
          return this
        }

        utils.flag(this, 'object', obj.error)
        return this
      }
    )

    utils.addProperty(
      chaiInstance.Assertion.prototype,
      '$okAsync',
      function okAsync(this: typeof chaiInstance.Assertion.prototype) {
        const obj = utils.flag(this, 'object')

        if (!(obj instanceof ResultAsync)) {
          throw new TypeError(`You must provide a ResultAsync to expect() when using .$okAsync, not '${typeof obj}'.`)
        }

        const proxy = new Proxy(this, {
          get: (target, key, receiver) => {
            const result = Reflect.get(target, key, receiver)

            if (typeof result !== 'function') {
              return result instanceof chaiInstance.Assertion ? proxy : result
            }

            return (...args: any[]) =>
              obj.then(
                (resolved) => {
                  this.assert(
                    safeIsOk(resolved),
                    'expected #{this} to be Ok',
                    'expected #{this} not to be Ok with value'
                  )

                  if (!safeIsOk(resolved)) {
                    return
                  }

                  utils.flag(this, 'object', resolved.value)
                  return result.call(this, ...args)
                },
                (error) => {
                  this.assert(
                    false,
                    'expected #{this} to be Ok with value, but it rejected the promise',
                    'expected #{this} not to be Ok with value, but it rejected the promise',
                    null,
                    error
                  )
                }
              )
          }
        })

        return proxy
      }
    )

    utils.addProperty(
      chaiInstance.Assertion.prototype,
      '$errAsync',
      function errAsync(this: typeof chaiInstance.Assertion.prototype) {
        const obj = utils.flag(this, 'object')

        if (!(obj instanceof ResultAsync)) {
          throw new TypeError(
            `You must provide a ResultAsync to expect() when using .$errAsync, not '${typeof obj}'.`
          )
        }

        const proxy = new Proxy(this, {
          get: (target, key, receiver) => {
            const result = Reflect.get(target, key, receiver)

            if (typeof result !== 'function') {
              return result instanceof chaiInstance.Assertion ? proxy : result
            }

            return (...args: Parameters<Chai.AssertionPrototype['assert']>) => obj.then(
              (resolved) => {
                this.assert(
                  safeIsErr(resolved),
                  'expected #{this} to be Err',
                  'expected #{this} not to be Err with value'
                )

                if (!safeIsErr(resolved)) {
                  return
                }

                utils.flag(this, 'object', resolved.error)
                return result.call(this, ...args)
              },
              (error) => {
                this.assert(
                  false,
                  'expected #{this} to be Err with value, but it rejected the promise',
                  'expected #{this} not to be Err with value, but it rejected the promise',
                  null,
                  error
                )
              }
            )
          }
        })

        return proxy
      }
    )
  })
}
