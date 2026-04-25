import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { LibModule } from './lib/lib.module';
import { UsersModule } from './modules/users/users.module';
import { CartsModule } from './modules/carts/carts.module';
import { SyncModule } from './modules/sync/sync.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CoreModule,
    LibModule,
    UsersModule,
    CartsModule,
    SyncModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
