import type { InjectionToken } from '@nestjs/common';

/** Cache de chaves string com valores serializados (por exemplo JSON). */
export interface Cache {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
}

export const CACHE: InjectionToken = Symbol('CACHE');
