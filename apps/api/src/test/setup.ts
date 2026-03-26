import { neverthrowMatchers } from '@carbplan/vitest-neverthrow'
import { expect } from 'vitest'

expect.extend(neverthrowMatchers)
