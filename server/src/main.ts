import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // project Description - Base Route
  app.setGlobalPrefix('api/v1');

  // Set Global-validation - setup global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist : true,
      forbidNonWhitelisted : false,
      transform : true,
      transformOptions : {
        enableImplicitConversion : true,
      },
    })
  );



  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(
  (error) => {
    Logger.error("Error starting server...! Error:", error);
    process.exit(1);
  }
);
