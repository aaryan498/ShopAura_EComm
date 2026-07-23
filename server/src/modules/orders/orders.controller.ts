import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiTooManyRequestsResponse, ApiQuery, ApiResponse, getSchemaPath, ApiForbiddenResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderApiResponseDto, OrderResponseDto, PaginatedOrderResponseDto } from './dto/order-response.dto';
import { ModerateThrottle, RelaxedThrottle } from 'src/common/decorators/custom-throttler.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { QueryOrderDto } from './dto/query-order.dto';

@ApiTags('Orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class OrdersController {

    constructor(
        private readonly ordersService: OrdersService
    ) {}

    @Post()
    @ModerateThrottle()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiBody({
        type: CreateOrderDto
    })
    @ApiCreatedResponse({
        description: 'The order has been successfully created.',
        type: OrderApiResponseDto
    })
    @ApiBadRequestResponse({
        description: 'Invalid data or insufficient stock.'
    })
    @ApiNotFoundResponse({
        description: 'Cart not found or empty'
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many requests - rate limit exceeded'
    })
    async create(@GetUser('id') id: string, @Body() createOrderDto: CreateOrderDto): Promise<OrderApiResponseDto<OrderResponseDto>> {
        return await this.ordersService.create(id, createOrderDto);
    }



    @Get('admin/all')
    @Roles(Role.ADMIN)
    @RelaxedThrottle()
    @ApiOperation({ summary: '[ADMIN] Get all orders' })
    @ApiQuery({
        name: 'status',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'search',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
    })
    @ApiResponse({
        description: 'List of all orders successfully retrieved',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        $ref: getSchemaPath(OrderResponseDto)
                    }
                },
                total: { type: "number" },
                page: { type: "number" },
                limit: { type: "number" },
            }
        }
    })
    @ApiForbiddenResponse({
        description: 'Admin access required',
    })
    async findAllForAdmin(@Query() queryDto: QueryOrderDto) : Promise<PaginatedOrderResponseDto>{
        return await this.ordersService.findAllForAdmin(queryDto);
    }


    @Get()
    @RelaxedThrottle()
    @Roles(Role.USER, Role.ADMIN)
    @ApiOperation({ summary: 'Get all orders for the current user' })
    @ApiQuery({
        name: 'status',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'status',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
    })
    @ApiOkResponse({
        description: 'Returns all orders for the current user',
        type: PaginatedOrderResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'User or Admin access required',
    })
    async findAllForUser(@GetUser('id') id: string, @Query() queryDto: QueryOrderDto) : Promise<PaginatedOrderResponseDto>{
        return await this.ordersService.findAllForUser(id, queryDto);
    }
    


}
