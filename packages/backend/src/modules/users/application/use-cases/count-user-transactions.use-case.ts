import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.token';

@Injectable()
export class CountUserTransactionsUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  execute(userId: number): Promise<number> {
    return this.userRepository.countTransactionsByUserId(userId);
  }
}
