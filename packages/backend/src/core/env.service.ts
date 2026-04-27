import { Global, Injectable } from '@nestjs/common';
import z from 'zod';

@Injectable()
@Global()
export class EnvService {
  getEnvs() {
    const envSchema = z.object({
      PORT: z.coerce.number().optional().default(3000),
      NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .optional()
        .default('development'),
      LOG_LEVEL: z
        .enum([
          'fatal',
          'error',
          'warn',
          'info',
          'debug',
          'trace',
          'silent',
        ])
        .optional(),
      EXTERNAL_API_URL: z.string().min(1),
      DATABASE_URL: z.string().min(1),
      REDIS_URL: z.string().min(1),
    });
    const { data, error } = envSchema.safeParse(process.env);
    if (error) throw new Error(`Invalid env vars: ${error.message}`);

    return data;
  }
}
