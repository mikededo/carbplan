import type { Options } from 'logixlysia'

import logixlysia from 'logixlysia'

const getConfiguration = (): Options => {
  if (Bun.env.ENVIRONMENT === 'development') {
    return {
      config: {
        customLogFormat: '{now} {level} {duration} {method} {pathname} {status} {message} {ip} {context}',
        pino: {
          level: 'debug',
          prettyPrint: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'HH:MM:ss Z'
          }
        },
        showStartupMessage: true,
        startupMessageFormat: 'banner'
      }
    }
  }

  return {
    config: {
      logFilePath: './logs/production.log',
      logFilter: { level: ['ERROR', 'WARNING'] },
      logRotation: {
        compress: true,
        interval: '1d',
        maxFiles: '30d',
        maxSize: '100m'
      },
      pino: {
        base: {
          environment: 'production',
          service: 'my-api',
          version: import.meta.env.APP_VERSION
        },
        level: 'info',
        redact: ['password', 'token', 'apiKey', 'creditCard']
      },
      showStartupMessage: false
    }
  }
}

export const createLoggerModule = () => logixlysia(getConfiguration())
