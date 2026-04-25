import { Module } from '@nestjs/common';
import { UsersModule } from '@/modules/users/users.module';
import { EXTERNAL_CARTS_GATEWAY } from './application/gateways/external-carts.gateway';
import { FetchCartByCartIdUseCase } from './application/use-cases/fetch-cart-by-cart-id.use-case';
import { ListCartsByInternalUserIdUseCase } from './application/use-cases/list-carts-by-internal-user-id.use-case';
import { CachingExternalCartsGateway } from './infrastructure/gateways/caching-external-carts.gateway';
import { HttpExternalCartsGateway } from './infrastructure/gateways/http-external-carts.gateway';
import { CartsController } from './infrastructure/http/carts.controller';

@Module({
  imports: [UsersModule],
  controllers: [CartsController],
  providers: [
    HttpExternalCartsGateway,
    CachingExternalCartsGateway,
    {
      provide: EXTERNAL_CARTS_GATEWAY,
      useExisting: CachingExternalCartsGateway,
    },
    FetchCartByCartIdUseCase,
    ListCartsByInternalUserIdUseCase,
  ],
  exports: [FetchCartByCartIdUseCase, ListCartsByInternalUserIdUseCase],
})
export class CartsModule {}
