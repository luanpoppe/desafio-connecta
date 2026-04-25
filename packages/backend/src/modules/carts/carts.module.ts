import { Module } from '@nestjs/common';
import { UsersModule } from '@/modules/users/users.module';
import { FetchCartByCartIdUseCase } from './application/use-cases/fetch-cart-by-cart-id.use-case';
import { ListCartsByInternalUserIdUseCase } from './application/use-cases/list-carts-by-internal-user-id.use-case';
import { CartsController } from './infrastructure/http/carts.controller';

@Module({
  imports: [UsersModule],
  controllers: [CartsController],
  providers: [FetchCartByCartIdUseCase, ListCartsByInternalUserIdUseCase],
  exports: [FetchCartByCartIdUseCase, ListCartsByInternalUserIdUseCase],
})
export class CartsModule {}
