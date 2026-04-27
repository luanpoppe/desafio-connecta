import { ExternalCartsCacheKeys } from '../external-carts-cache.keys';

describe('ExternalCartsCacheKeys', () => {
  it('userCarts builds namespaced key with external user id', () => {
    expect(ExternalCartsCacheKeys.userCarts(7)).toBe('carts:user:7');
  });

  it('cartById builds namespaced key with cart id', () => {
    expect(ExternalCartsCacheKeys.cartById(42)).toBe('carts:id:42');
  });
});
