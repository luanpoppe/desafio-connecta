import { USER_REPOSITORY } from '@/modules/users/domain/repositories/user.repository';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EXTERNAL_CARTS_GATEWAY } from '../gateways/external-carts.gateway';
import type { ExternalCartsGateway } from '../gateways/external-carts.gateway';
import { ListCartsByInternalUserIdUseCase } from '../use-cases/list-carts-by-internal-user-id.use-case';

describe('ListCartsByInternalUserIdUseCase', () => {
  let useCase: ListCartsByInternalUserIdUseCase;
  let userRepository: jest.Mocked<
    Pick<UserRepository, 'findExternalIdByInternalUserId'>
  >;
  let externalCarts: jest.Mocked<
    Pick<ExternalCartsGateway, 'getCartsByUser'>
  >;

  beforeEach(async () => {
    userRepository = {
      findExternalIdByInternalUserId: jest.fn(),
    };
    externalCarts = {
      getCartsByUser: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ListCartsByInternalUserIdUseCase,
        { provide: USER_REPOSITORY, useValue: userRepository },
        { provide: EXTERNAL_CARTS_GATEWAY, useValue: externalCarts },
      ],
    }).compile();

    useCase = moduleRef.get(ListCartsByInternalUserIdUseCase);
  });

  it('throws when internal user is unknown', async () => {
    userRepository.findExternalIdByInternalUserId.mockResolvedValue(null);
    await expect(useCase.execute(999)).rejects.toBeInstanceOf(NotFoundException);
    expect(externalCarts.getCartsByUser).not.toHaveBeenCalled();
  });

  it('loads carts by external id and maps summary', async () => {
    userRepository.findExternalIdByInternalUserId.mockResolvedValue(42);
    externalCarts.getCartsByUser.mockResolvedValue({
      carts: [
        {
          id: 1,
          products: [],
          total: 5,
          discountedTotal: 5,
          userId: 42,
          totalProducts: 1,
          totalQuantity: 1,
        },
      ],
      total: 1,
      skip: 0,
      limit: 10,
    });

    const result = await useCase.execute(7);

    expect(userRepository.findExternalIdByInternalUserId).toHaveBeenCalledWith(7);
    expect(externalCarts.getCartsByUser).toHaveBeenCalledWith(42);
    expect(result.summary.transactionCount).toBe(1);
    expect(result.summary.totalSum).toBe(5);
  });
});
