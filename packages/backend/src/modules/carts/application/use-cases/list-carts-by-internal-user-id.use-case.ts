import {
  ExternalApiService,
  type GetCartsResponseDto,
} from '@/lib/external-api';
import { USER_REPOSITORY } from '@/modules/users/domain/repositories/user.repository.token';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ListCartsByInternalUserIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly externalApi: ExternalApiService,
  ) {}

  async execute(internalUserId: number): Promise<GetCartsResponseDto> {
    const externalUserId =
      await this.userRepository.findExternalIdByInternalUserId(internalUserId);

    if (externalUserId === null) {
      throw new NotFoundException(
        `Utilizador com id ${internalUserId} não encontrado.`,
      );
    }
    return this.externalApi.getCartsByUser(externalUserId);
  }
}
