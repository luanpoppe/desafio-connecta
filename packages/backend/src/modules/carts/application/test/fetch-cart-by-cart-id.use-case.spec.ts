import { Test } from '@nestjs/testing';
import { EXTERNAL_CARTS_GATEWAY } from '../gateways/external-carts.gateway';
import type { ExternalCartsGateway } from '../gateways/external-carts.gateway';
import { FetchCartByCartIdUseCase } from '../use-cases/fetch-cart-by-cart-id.use-case';

describe('FetchCartByCartIdUseCase', () => {
  let useCase: FetchCartByCartIdUseCase;
  let externalCarts: jest.Mocked<Pick<ExternalCartsGateway, 'getCartById'>>;

  beforeEach(async () => {
    externalCarts = { getCartById: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        FetchCartByCartIdUseCase,
        { provide: EXTERNAL_CARTS_GATEWAY, useValue: externalCarts },
      ],
    }).compile();
    useCase = moduleRef.get(FetchCartByCartIdUseCase);
  });

  it('delegates to gateway', async () => {
    const cart = {
      id: 3,
      products: [],
      total: 1,
      discountedTotal: 1,
      userId: 1,
      totalProducts: 0,
      totalQuantity: 0,
    };
    externalCarts.getCartById.mockResolvedValue(cart);

    await expect(useCase.execute(3)).resolves.toEqual(cart);
    expect(externalCarts.getCartById).toHaveBeenCalledWith(3);
  });
});
