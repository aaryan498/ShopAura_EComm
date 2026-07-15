import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // project Description - Base Route
  app.setGlobalPrefix('api/v1');

  // Set Global-validation - setup global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Setup CORS
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })


  // Enable Swagger Docs
  const config = new DocumentBuilder()
    .setTitle('ShopAura E-Commerce NestJS API')
    .setDescription('NestJS API')
    .setVersion('1.0')
    .addTag('auth', 'Authentication related endpoints')
    .addTag('users', 'User management related endpoints')
    .addTag('products', 'Product management related endpoints')
    .addTag('orders', 'Order management related endpoints')
    .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      }, 'JWT-auth',
    )
    .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Refresh-JWT',
        description: 'Enter Refresh JWT token',
        in: 'header',
      }, 'JWT-Refresh',
    )
    .addServer('http://localhost:3000', 'Development Server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'ShopAura API Docs',
    customfavIcon: 'https://nestjs.com/img/logo_small.svg',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0; }
      .swagger-ui .info .title { color: #4A90E2; }
    `
  });



  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(
  (error) => {
    Logger.error("Error starting server...! Error:", error);
    process.exit(1);
  }
);
