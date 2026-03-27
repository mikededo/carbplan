import type { Mock } from 'vitest'

import { vi } from 'vitest'

type Stubbable = Record<string, (...args: any[]) => any>
type Stub<T extends Stubbable> = {
  [K in keyof T]: Mock<T[K]>;
}
export const createStub = <T extends Stubbable>(keys: Array<keyof T>): Stub<T> =>
  Object.fromEntries(keys.map((key) => [key, vi.fn()])) as Stub<T>
