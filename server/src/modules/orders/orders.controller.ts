import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('Orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class OrdersController {

    constructor(
        private readonly ordersService: OrdersService
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
        return await this.ordersService.create(createOrderDto);
    }


}
