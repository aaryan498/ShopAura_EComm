import { Body, Controller, Get, Post, Patch, Query, Param, UseGuards, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiTooManyRequestsResponse, ApiQuery, ApiResponse, getSchemaPath, ApiForbiddenResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderApiResponseDto, OrderResponseDto, PaginatedOrderResponseDto } from './dto/order-response.dto';
import { ModerateThrottle, RelaxedThrottle } from 'src/common/decorators/custom-throttler.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

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
    @ApiOkResponse({
        description: 'List of all orders successfully retrieved',
        type: PaginatedOrderResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Admin access required',
    })
    async findAllForAdmin(@Query() queryDto: QueryOrderDto) : Promise<PaginatedOrderResponseDto>{
        return await this.ordersService.findAll(queryDto);
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
    @ApiOkResponse({
        description: 'Returns all orders for the current user',
        type: PaginatedOrderResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'User or Admin access required',
    })
    async findAllForUser(@Query() queryDto: QueryOrderDto, @GetUser('id') id: string,) : Promise<PaginatedOrderResponseDto>{
        return await this.ordersService.findAll(queryDto, id);
    }



    @Get('admin/:id')
    @Roles(Role.ADMIN)
    @RelaxedThrottle()
    @ApiOperation({ summary: '[ADMIN] Get a single order by ID' })
    @ApiParam({
        name: 'id',
        description: 'Order ID'
    })
    @ApiOkResponse({
        description: 'Returns a single order',
        type: OrderApiResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Admin access required',
    })
    @ApiNotFoundResponse({
        description: 'Order not found',
    })
    async findOneAdmin(@Param('id') id: string) : Promise<OrderApiResponseDto<OrderResponseDto>> {
        return await this.ordersService.findOne(id);
    }




    @Get(':id')
    @RelaxedThrottle()
    @ApiOperation({ summary: '[USER] Get a single order by ID' })
    @ApiParam({
        name: 'id',
        description: 'Order ID'
    })
    @ApiOkResponse({
        description: 'Returns a single order',
        type: OrderApiResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Not Authenticated',
    })
    @ApiNotFoundResponse({
        description: 'User or Order not found',
    })
    async findOneUser(@Param('id') id: string, @GetUser('id') userId: string) : Promise<OrderApiResponseDto<OrderResponseDto>> {
        return await this.ordersService.findOne(id, userId);
    }




    @Patch('admin/:id')
    @Roles(Role.ADMIN)
    @ModerateThrottle()
    @ApiOperation({
        summary: 'Update Order',
        description: 'Update Order by Admin'
    })
    @ApiParam({
        name: 'id',
        description: 'Order ID'
    })
    @ApiBody({
        type: UpdateOrderDto,
    })
    @ApiOkResponse({
        description: 'Update Order Successfully',
        type: OrderApiResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Admin Role required'
    })
    @ApiNotFoundResponse({
        description: 'Order not Found'
    })
    async updateOrderAdmin(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) : Promise<OrderApiResponseDto<OrderResponseDto>> {
        return await this.ordersService.update(id, updateOrderDto);
    }




    @Patch(':id')
    @ModerateThrottle()
    @ApiOperation({
        summary: 'Update Order',
        description: 'Update Order by User'
    })
    @ApiParam({
        name: 'id',
        description: 'Order ID'
    })
    @ApiBody({
        type: UpdateOrderDto,
    })
    @ApiOkResponse({
        description: 'Update Order Successfully',
        type: OrderApiResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Not Authenticated'
    })
    @ApiNotFoundResponse({
        description: 'Order not Found'
    })
    async updateOrderUser(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @GetUser('id') userId: string) : Promise<OrderApiResponseDto<OrderResponseDto>> {
        return await this.ordersService.update(id, updateOrderDto, userId);
    }



    @Delete('admin/:id')
    @Roles(Role.ADMIN)
    @ModerateThrottle()
    @ApiOperation({
        summary: 'Delete Order',
        description: 'Delete Order by ID by Admin'
    })
    @ApiParam({
        name: 'id',
        description: 'Order ID'
    })
    @ApiOkResponse({
        description: 'Delete Order Successfully',
        type: OrderApiResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Admin Access Required'
    })
    @ApiNotFoundResponse({
        description: 'Order not Found'
    })
    async cancelOrderAdmin(@Param('id') id: string) : Promise<OrderApiResponseDto<OrderResponseDto>> {
        return await this.ordersService.cancel(id);
    }



    @Delete(':id')
    @ModerateThrottle()
    @ApiOperation({
        summary: 'Delete Order',
        description: 'Delete Order by ID by User - Own order only'
    })
    @ApiParam({
        name: 'id',
        description: 'Order ID'
    })
    @ApiOkResponse({
        description: 'Delete Order Successfully',
        type: OrderApiResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Admin Access Required'
    })
    @ApiNotFoundResponse({
        description: 'Order not Found'
    })
    async cancelOrderUser(@Param('id') id: string, @GetUser('id') userId: string) : Promise<OrderApiResponseDto<OrderResponseDto>> {
        return await this.ordersService.cancel(id, userId);
    }

    



    

    


}
