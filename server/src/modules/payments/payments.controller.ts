import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiBadRequestResponse, ApiOkResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags, ApiNotFoundResponse, ApiForbiddenResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreatePaymentIntentApiResponseDto, PaymentApiResponseDto, PaymentResponseDto } from './dto/payment-response.dto';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';

@Controller('payments')
@ApiTags('Payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PaymentsController {

    constructor( private readonly paymentsService: PaymentsService ) {}


    @Post('create-intent')
    @ApiOperation({
        summary: 'Create payment intent',
        description: 'Create a payment intent for an order'
    })
    @ApiBody({
        type: CreatePaymentIntentDto,
        description: 'Create payment intent request body',
    })
    @ApiCreatedResponse({
        description: 'Payment intent created successfully',
        type: CreatePaymentIntentApiResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Bad request - Invalid request data or Not Found Error',
    })
    async createPaymentIntent(@GetUser('id') userId: string, @Body() createPaymentIntentDto: CreatePaymentIntentDto) {
        return this.paymentsService.createPaymentIntent(userId, createPaymentIntentDto);
    }



    @Post('confirm')
    @ApiOperation({
        summary: 'Confirm Payment',
        description: 'Confirm a payment intent for an order'
    })
    @ApiBody({
        type: ConfirmPaymentDto,
        description: 'Confirm payment request body',
    })
    @ApiOkResponse({
        description: 'Payment confirmed successfully',
        type: PaymentApiResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Payment not found or already completed',
    })
    async confirmPayment(@GetUser('id') userId: string, @Body() confirmPaymentDto: ConfirmPaymentDto) {
        return await this.paymentsService.confirmPayment(userId, confirmPaymentDto);
    }



    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiOperation({
        summary: 'Get all payments',
        description: 'Get all payments for a user'
    })
    @ApiOkResponse({
        description: 'Payments retrieved successfully',
        type: PaymentApiResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'User payments not found',
    })
    @ApiForbiddenResponse({
        description: 'Not Authenticated'
    })
    async getAllPayments(@GetUser('id') userId: string): Promise<{
        success: boolean,
        data: PaymentResponseDto[],
        message?: string
    }> {
        return await this.paymentsService.getAllPayments(userId);
    }



    @Get(':id')
    @ApiOperation({
        summary: 'Get payment by ID',
        description: 'Get a specific payment by its ID'
    })
    @ApiParam({
        name: 'id',
        description: 'Payment ID',
        example: '12kdbvkbzdkv-kshvdvhskh-2sdbsdbdbs',
    })
    @ApiOkResponse({
        description: 'Payment retrieved successfully',
        type: PaymentApiResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Payment not found',
    })
    @ApiForbiddenResponse({
        description: 'Not Authenticated'
    })
    async findOne(@Param('id') id: string, @GetUser('id') userId: string): Promise<PaymentApiResponseDto> {
        return await this.paymentsService.findOne(id, userId);
    }




    @Get('order/:orderId')
    @ApiOperation({
        summary: 'Get payment by order ID',
        description: 'Get a specific payment by its order ID'
    })
    @ApiParam({
        name: 'orderId',
        description: 'Order ID',
        example: '12kdbvkbzdkv-kshvdvhskh-2sdbsdbdbs',
    })
    @ApiOkResponse({
        description: 'Payment retrieved successfully',
        type: PaymentApiResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Payment not found',
    })
    @ApiForbiddenResponse({
        description: 'Not Authenticated'
    })
    async findByOrderId(@Param('orderId') orderId: string, @GetUser('id') userId: string): Promise<{
        success: boolean,
        data: PaymentResponseDto | null,
        message?: string
    }> {
        return await this.paymentsService.findByOrderId(orderId, userId);
    }

}
