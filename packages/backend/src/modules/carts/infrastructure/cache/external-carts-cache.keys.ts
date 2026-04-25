const NAMESPACE = 'carts';

export class ExternalCartsCacheKeys {
  static userCarts(externalUserId: number): string {
    return `${NAMESPACE}:user:${externalUserId}`;
  }

  static cartById(cartId: number): string {
    return `${NAMESPACE}:id:${cartId}`;
  }
}
