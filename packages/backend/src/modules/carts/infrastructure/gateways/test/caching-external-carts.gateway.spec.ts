import { RedisService } from '@/lib/cache/redis.service';
import type { CartDto, GetCartsResponseDto } from '@/lib/external-api';
import { Test } from '@nestjs/testing';
import { ExternalCartsCacheKeys } from '../../cache/external-carts-cache.keys';
import { CachingExternalCartsGateway } from '../caching-external-carts.gateway';
import { HttpExternalCartsGateway } from '../http-external-carts.gateway';

const CACHE_TTL_SECONDS = 60 * 5;

function minimalCart(overrides: Partial<CartDto> = {}): CartDto {
  return {
    id: 1,
    products: [],
    total: 10,
    discountedTotal: 10,
    userId: 42,
    totalProducts: 0,
    totalQuantity: 0,
    ...overrides,
  };
}

function minimalGetCartsResponse(
  overrides: Partial<GetCartsResponseDto> = {},
): GetCartsResponseDto {
  const cart = minimalCart();
  return {
    carts: [cart],
    total: 1,
    skip: 0,
    limit: 10,
    ...overrides,
  };
}

describe('CachingExternalCartsGateway', () => {
  let gateway: CachingExternalCartsGateway;
  let inner: jest.Mocked<Pick<HttpExternalCartsGateway, 'getCartsByUser' | 'getCartById'>>;
  let redis: jest.Mocked<Pick<RedisService, 'get' | 'set' | 'del'>>;

  beforeEach(async () => {
    inner = {
      getCartsByUser: jest.fn(),
      getCartById: jest.fn(),
    };
    redis = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        CachingExternalCartsGateway,
        { provide: HttpExternalCartsGateway, useValue: inner },
        { provide: RedisService, useValue: redis },
      ],
    }).compile();
    gateway = moduleRef.get(CachingExternalCartsGateway);
  });

  describe('getCartsByUser', () => {
    it('on cache miss fetches from inner, writes redis with TTL, returns payload', async () => {
      const key = ExternalCartsCacheKeys.userCarts(7);
      const fresh = minimalGetCartsResponse();
      redis.get.mockResolvedValue(null);
      inner.getCartsByUser.mockResolvedValue(fresh);

      await expect(gateway.getCartsByUser(7)).resolves.toEqual(fresh);

      expect(redis.get).toHaveBeenCalledWith(key);
      expect(inner.getCartsByUser).toHaveBeenCalledWith(7);
      expect(redis.set).toHaveBeenCalledWith(
        key,
        JSON.stringify(fresh),
        CACHE_TTL_SECONDS,
      );
    });

    it('on cache hit returns parsed payload without calling inner', async () => {
      const key = ExternalCartsCacheKeys.userCarts(3);
      const cached = minimalGetCartsResponse();
      redis.get.mockResolvedValue(JSON.stringify(cached));

      await expect(gateway.getCartsByUser(3)).resolves.toEqual(cached);

      expect(redis.get).toHaveBeenCalledWith(key);
      expect(inner.getCartsByUser).not.toHaveBeenCalled();
      expect(redis.set).not.toHaveBeenCalled();
    });

    it('on invalid cache deletes key, refetches, and repopulates', async () => {
      const key = ExternalCartsCacheKeys.userCarts(8);
      const fresh = minimalGetCartsResponse();
      redis.get.mockResolvedValue('not-json{');
      inner.getCartsByUser.mockResolvedValue(fresh);

      await expect(gateway.getCartsByUser(8)).resolves.toEqual(fresh);

      expect(redis.del).toHaveBeenCalledWith(key);
      expect(inner.getCartsByUser).toHaveBeenCalledWith(8);
      expect(redis.set).toHaveBeenCalledWith(
        key,
        JSON.stringify(fresh),
        CACHE_TTL_SECONDS,
      );
    });
  });

  describe('getCartById', () => {
    it('on cache miss fetches from inner, writes redis with TTL, returns payload', async () => {
      const key = ExternalCartsCacheKeys.cartById(11);
      const fresh = minimalCart({ id: 11 });
      redis.get.mockResolvedValue(null);
      inner.getCartById.mockResolvedValue(fresh);

      await expect(gateway.getCartById(11)).resolves.toEqual(fresh);

      expect(redis.get).toHaveBeenCalledWith(key);
      expect(inner.getCartById).toHaveBeenCalledWith(11);
      expect(redis.set).toHaveBeenCalledWith(
        key,
        JSON.stringify(fresh),
        CACHE_TTL_SECONDS,
      );
    });

    it('on cache hit returns parsed payload without calling inner', async () => {
      const key = ExternalCartsCacheKeys.cartById(4);
      const cached = minimalCart({ id: 4 });
      redis.get.mockResolvedValue(JSON.stringify(cached));

      await expect(gateway.getCartById(4)).resolves.toEqual(cached);

      expect(redis.get).toHaveBeenCalledWith(key);
      expect(inner.getCartById).not.toHaveBeenCalled();
      expect(redis.set).not.toHaveBeenCalled();
    });

    it('on invalid cache deletes key, refetches, and repopulates', async () => {
      const key = ExternalCartsCacheKeys.cartById(2);
      const fresh = minimalCart({ id: 2 });
      redis.get.mockResolvedValue('{"id":2}');
      inner.getCartById.mockResolvedValue(fresh);

      await expect(gateway.getCartById(2)).resolves.toEqual(fresh);

      expect(redis.del).toHaveBeenCalledWith(key);
      expect(inner.getCartById).toHaveBeenCalledWith(2);
      expect(redis.set).toHaveBeenCalledWith(
        key,
        JSON.stringify(fresh),
        CACHE_TTL_SECONDS,
      );
    });
  });
});
