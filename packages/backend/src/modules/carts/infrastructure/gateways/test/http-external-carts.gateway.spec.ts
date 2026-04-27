import { EXTERNAL_API, type ExternalApi } from '@/lib/external-api';
import { Test } from '@nestjs/testing';
import type { CartDto, GetCartsResponseDto } from '@/lib/external-api';
import { HttpExternalCartsGateway } from '../http-external-carts.gateway';

describe('HttpExternalCartsGateway', () => {
  let gateway: HttpExternalCartsGateway;
  let externalApi: jest.Mocked<
    Pick<ExternalApi, 'getCartsByUser' | 'getCartById'>
  >;

  beforeEach(async () => {
    externalApi = {
      getCartsByUser: jest.fn(),
      getCartById: jest.fn(),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        HttpExternalCartsGateway,
        { provide: EXTERNAL_API, useValue: externalApi },
      ],
    }).compile();
    gateway = moduleRef.get(HttpExternalCartsGateway);
  });

  it('getCartsByUser delegates to ExternalApi', async () => {
    const payload = {
      carts: [],
      total: 0,
      skip: 0,
      limit: 10,
    } satisfies GetCartsResponseDto;
    externalApi.getCartsByUser.mockResolvedValue(payload);

    await expect(gateway.getCartsByUser(99)).resolves.toEqual(payload);
    expect(externalApi.getCartsByUser).toHaveBeenCalledWith(99);
  });

  it('getCartById delegates to ExternalApi', async () => {
    const cart = {
      id: 5,
      products: [],
      total: 1,
      discountedTotal: 1,
      userId: 1,
      totalProducts: 0,
      totalQuantity: 0,
    } satisfies CartDto;
    externalApi.getCartById.mockResolvedValue(cart);

    await expect(gateway.getCartById(5)).resolves.toEqual(cart);
    expect(externalApi.getCartById).toHaveBeenCalledWith(5);
  });
});
