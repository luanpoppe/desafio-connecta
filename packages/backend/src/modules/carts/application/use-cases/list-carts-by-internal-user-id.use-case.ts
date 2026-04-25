import { ExternalApiService } from '@/lib/external-api';
import { USER_REPOSITORY } from '@/modules/users/domain/repositories/user.repository.token';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { CartsByUserWithSummaryResponse } from '../dtos/carts-by-user-with-summary.dto';
import { CartsByUserWithSummaryMapper } from '../mappers/carts-by-user-with-summary.mapper';

@Injectable()
export class ListCartsByInternalUserIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly externalApi: ExternalApiService,
  ) {}

  async execute(
    internalUserId: number,
  ): Promise<CartsByUserWithSummaryResponse> {
    const externalUserId =
      await this.userRepository.findExternalIdByInternalUserId(internalUserId);

    if (externalUserId === null) {
      throw new NotFoundException(
        `Utilizador com id ${internalUserId} não encontrado.`,
      );
    }
    const data = await this.externalApi.getCartsByUser(externalUserId);
    return CartsByUserWithSummaryMapper.toWithSummary(data);
  }
}
