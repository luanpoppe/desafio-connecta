import { RedisService } from '@/lib/cache/redis.service';
import type { CartDto, GetCartsResponseDto } from '@/lib/external-api';
import {
  cartSchema,
  getCartsResponseSchema,
} from '@/lib/external-api/dtos/carts.dto';
import { Injectable, Logger } from '@nestjs/common';
import type { ExternalCartsGateway } from '../../application/gateways/external-carts.gateway';
import { ExternalCartsCacheKeys } from '../cache/external-carts-cache.keys';
import { HttpExternalCartsGateway } from './http-external-carts.gateway';

const CACHE_TTL_SECONDS = 60 * 5; // 5 minutos

@Injectable()
export class CachingExternalCartsGateway implements ExternalCartsGateway {
  private readonly logger = new Logger(CachingExternalCartsGateway.name);

  constructor(
    private readonly inner: HttpExternalCartsGateway,
    private readonly redis: RedisService,
  ) {}

  async getCartsByUser(externalUserId: number): Promise<GetCartsResponseDto> {
    const key = ExternalCartsCacheKeys.userCarts(externalUserId);
    const cached = await this.redis.get(key);

    if (cached !== null) {
      try {
        const parsed = getCartsResponseSchema.parse(JSON.parse(cached));
        this.logger.log(
          `Cache hit: carrinhos por utilizador externo ${externalUserId} (key=${key}, ${parsed.carts.length} carrinhos).`,
        );
        return parsed;
      } catch {
        this.logger.warn(`Cache inválido para ${key}; a repor da origem.`);
        await this.redis.del(key);
      }
    }

    const fresh = await this.inner.getCartsByUser(externalUserId);
    await this.redis.set(key, JSON.stringify(fresh), CACHE_TTL_SECONDS);
    this.logger.log(
      `Cache miss: carrinhos por utilizador externo ${externalUserId} obtidos na origem e gravados (key=${key}, ${fresh.carts.length} carrinhos, TTL=${CACHE_TTL_SECONDS}s).`,
    );
    return fresh;
  }

  async getCartById(cartId: number): Promise<CartDto> {
    const key = ExternalCartsCacheKeys.cartById(cartId);
    const cached = await this.redis.get(key);

    if (cached !== null) {
      try {
        const parsed = cartSchema.parse(JSON.parse(cached));
        this.logger.log(
          `Cache hit: carrinho ${cartId} (key=${key}, total=${parsed.total}).`,
        );
        return parsed;
      } catch {
        this.logger.warn(`Cache inválido para ${key}; a repor da origem.`);
        await this.redis.del(key);
      }
    }

    const fresh = await this.inner.getCartById(cartId);
    await this.redis.set(key, JSON.stringify(fresh), CACHE_TTL_SECONDS);
    this.logger.log(
      `Cache miss: carrinho ${cartId} obtido na origem e gravado (key=${key}, total=${fresh.total}, TTL=${CACHE_TTL_SECONDS}s).`,
    );
    return fresh;
  }
}
