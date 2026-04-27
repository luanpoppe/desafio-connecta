import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { SwaggerModule } from '@nestjs/swagger';
import { ZodValidationPipe, cleanupOpenApiDoc } from 'nestjs-zod';
import { createSwaggerConfig } from './core/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);
  app.useLogger(logger);

  logger.log('Starting application...', 'Bootstrap');

  app.useGlobalPipes(new ZodValidationPipe());
  logger.log('ZodValidationPipe enabled', 'Bootstrap');

  const config = createSwaggerConfig();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(document));
  logger.log('Swagger enabled', 'Bootstrap');

  app.enableCors();
  logger.log('CORS enabled', 'Bootstrap');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Server is running on port ${port}`, 'Bootstrap');
}
void bootstrap();
