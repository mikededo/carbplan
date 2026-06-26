import { neverthrowMatchers } from '@kilo/vitest-neverthrow'
import { expect } from 'vitest'

expect.extend(neverthrowMatchers)
