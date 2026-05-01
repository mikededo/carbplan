import type { Result, ResultAsync } from 'neverthrow'

export const resultValueOrThrow = <T, E>(result: Result<T, E>): T => {
  if (result.isErr()) {
    throw result.error
  }

  return result.value
}

export const resultAsyncValueOrThrow = async <T, E>(
  result: ResultAsync<T, E>
): Promise<T> => resultValueOrThrow(await result)

export const liftResultAsync = <T, E>(fn: () => ResultAsync<T, E>) =>
  () => resultAsyncValueOrThrow(fn())

