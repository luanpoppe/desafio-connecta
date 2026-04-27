import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { Test } from '@nestjs/testing';
import { ListUsersPaginatedUseCase } from '../use-cases/list-users-paginated.use-case';

describe('ListUsersPaginatedUseCase', () => {
  it('delegates to repository', async () => {
    const userRepository: jest.Mocked<
      Pick<UserRepository, 'listAllPaginated'>
    > = {
      listAllPaginated: jest.fn().mockResolvedValue({
        items: [],
        totalItems: 0,
        page: 1,
        pageSize: 5,
      }),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ListUsersPaginatedUseCase,
        { provide: USER_REPOSITORY, useValue: userRepository },
      ],
    }).compile();

    const useCase = moduleRef.get(ListUsersPaginatedUseCase);
    const params = { page: 2, pageSize: 10 } as const;

    await expect(useCase.execute(params)).resolves.toEqual({
      items: [],
      totalItems: 0,
      page: 1,
      pageSize: 5,
    });
    expect(userRepository.listAllPaginated).toHaveBeenCalledWith(params);
  });
});
