import {
  USER_REPOSITORY,
  type UserRepository,
} from '@/modules/users/domain/repositories/user.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  EXTERNAL_CARTS_GATEWAY,
  type ExternalCartsGateway,
} from '../gateways/external-carts.gateway';
import type { CartsByUserWithSummaryResponse } from '../dtos/carts-by-user-with-summary.dto';
import { CartsByUserWithSummaryMapper } from '../mappers/carts-by-user-with-summary.mapper';

@Injectable()
export class ListCartsByInternalUserIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(EXTERNAL_CARTS_GATEWAY)
    private readonly externalCarts: ExternalCartsGateway,
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
    const data = await this.externalCarts.getCartsByUser(externalUserId);
    return CartsByUserWithSummaryMapper.toWithSummary(data);
  }
}
