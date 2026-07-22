import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { seconds, ThrottlerModule } from '@nestjs/throttler';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: seconds(60),
          limit: 10,
        }
      ]
    }),
    PrismaModule, AuthModule, UsersModule, CategoriesModule, ProductsModule, OrdersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
