import type { Params } from 'nestjs-pino';
import type { Options } from 'pino-http';

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProduction = nodeEnv === 'production';
const isTest = nodeEnv === 'test';

function resolveLevel(): string {
  if (process.env.LOG_LEVEL) return process.env.LOG_LEVEL;
  if (isTest) return 'silent';
  return 'info';
}

export function buildLoggerModuleParams(): Params {
  const level = resolveLevel();

  const base: Options = {
    level,
    autoLogging: !isTest,
    redact: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["set-cookie"]',
    ],
  };

  const pinoHttp: Options =
    !isProduction && !isTest
      ? {
          ...base,
          transport: {
            target: 'pino-pretty',
            options: { singleLine: true, colorize: true },
          },
        }
      : base;

  return { pinoHttp };
}
