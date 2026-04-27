import { EnvService } from '../env.service';

describe('EnvService', () => {
  const service = new EnvService();
  const keys = [
    'EXTERNAL_API_URL',
    'DATABASE_URL',
    'REDIS_URL',
  ] as const;

  let saved: Record<string, string | undefined>;

  beforeEach(() => {
    saved = {};
    for (const k of keys) {
      saved[k] = process.env[k];
      process.env[k] = process.env[k] ?? 'https://example.test';
    }
    process.env.EXTERNAL_API_URL = 'https://api.external.test';
    process.env.DATABASE_URL = 'postgresql://localhost:5432/test';
    process.env.REDIS_URL = 'redis://localhost:6379';
  });

  afterEach(() => {
    for (const k of keys) {
      if (saved[k] === undefined) {
        delete process.env[k];
      } else {
        process.env[k] = saved[k];
      }
    }
    delete process.env.PORT;
  });

  it('returns parsed env with defaults for PORT', () => {
    delete process.env.PORT;
    const env = service.getEnvs();
    expect(env.PORT).toBe(3000);
    expect(env.EXTERNAL_API_URL).toBe('https://api.external.test');
    expect(env.DATABASE_URL).toBe('postgresql://localhost:5432/test');
    expect(env.REDIS_URL).toBe('redis://localhost:6379');
  });

  it('coerces PORT to number', () => {
    process.env.PORT = '8080';
    const env = service.getEnvs();
    expect(env.PORT).toBe(8080);
  });

  it('throws when required vars are missing', () => {
    delete process.env.EXTERNAL_API_URL;
    expect(() => service.getEnvs()).toThrow(/Invalid env vars/);
  });
});
