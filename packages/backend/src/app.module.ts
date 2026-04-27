import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { buildLoggerModuleParams } from './core/pino-logger.options';
import { LibModule } from './lib/lib.module';
import { UsersModule } from './modules/users/users.module';
import { CartsModule } from './modules/carts/carts.module';
import { SyncModule } from './modules/sync/sync.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    LoggerModule.forRoot(buildLoggerModuleParams()),
    CoreModule,
    LibModule,
    UsersModule,
    CartsModule,
    SyncModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
