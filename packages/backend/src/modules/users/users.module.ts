import { Module } from '@nestjs/common';
import { ListUsersPaginatedUseCase } from './application/use-cases/list-users-paginated.use-case';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { UsersController } from './infrastructure/http/users.controller';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    PrismaUserRepository,
    { provide: USER_REPOSITORY, useExisting: PrismaUserRepository },
    ListUsersPaginatedUseCase,
  ],
  exports: [USER_REPOSITORY, ListUsersPaginatedUseCase],
})
export class UsersModule {}
