import { elysiaLogger } from '@logtape/elysia'
import * as Logtape from '@logtape/logtape'

export const createLogger = async () => {
  await Logtape.configure({
    filters: {},
    loggers: [
      { category: ['logtape', 'meta'], lowestLevel: 'warning', sinks: ['console'] },
      { category: [], lowestLevel: 'debug', sinks: ['console'] }
    ],
    sinks: {
      console: Logtape.getConsoleSink({
        formatter: Logtape.ansiColorFormatter
      })
    }
  })

  return elysiaLogger()
}
