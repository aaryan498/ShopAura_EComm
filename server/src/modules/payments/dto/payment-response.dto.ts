import { ApiProperty } from "@nestjs/swagger";


export class CreatePaymentIntentResponseDto {
    @ApiProperty({
        description: 'Client secret for the payment confirmation',
        example: 'pi_3P9f1qKZB2Zvcoi600eF4q3z_secret_kX3z3J4J5J6J7J8J9J0J',
    })
    clientSecret!: string;

    @ApiProperty({
        description: 'Payment ID in Database',
        example: 'pi_3P9f1qKZB2Zvcoi600eF4q3z',
    })
    paymentId!: string;

}

export class CreatePaymentIntentApiResponseDto {

    @ApiProperty({
        description: 'Create Payment intent response status',
        example: 'true',
    })
    success!: boolean;

    @ApiProperty({
        description: 'Create payment intent response data',
        type: CreatePaymentIntentResponseDto,
    })
    data!: CreatePaymentIntentResponseDto;

    @ApiProperty({
        description: 'Create payment intent request related optional message',
        example: 'Payment intent created successfully',
        required: false,
    })
    message?: string;

}





export class PaymentResponseDto {

    @ApiProperty({
        description: 'Payment ID - [DATABASE]',
        example: '12kdbvkbzdkv-kshvdvhskh-2sdbsdbdbs',
    })
    id!: string;


    @ApiProperty({
        description: 'Order ID - [DATABASE]',
        example: '12kdbvkbzdkv-kshvdvhskh-2sdbsdbdbs',
    })
    orderId!: string;

    @ApiProperty({
        description: 'User ID - [DATABASE]',
        example: '12kdbvkbzdkv-kshvdvhskh-2sdbsdbdbs',
    })
    userId!: string;


    @ApiProperty({
        description: 'Payment amount',
        example: '199.99',
    })
    amount!: number;


    @ApiProperty({
        description: 'Payment currency',
        example: 'USD',
    })
    currency!: string;


    @ApiProperty({
        description: 'Payment status',
        example: 'COMPLETED',
        enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']
    })
    status!: string;

    @ApiProperty({
        description: 'Payment method',
        example: 'STRIPE',
        nullable: true
    })
    paymentMethod!: string | null;

    @ApiProperty({
        description: 'Payment transaction ID',
        example: 'pi_418414394326gyg',
        nullable: true
    })
    transactionId!: string | null;

    @ApiProperty({
        description: 'Payment created at',
        example: '2023-01-01T00:00:00.000Z',
    })
    createdAt!: Date;

    @ApiProperty({
        description: 'Payment updated at',
        example: '2023-01-01T00:00:00.000Z',
    })
    updatedAt!: Date;

}

export class PaymentApiResponseDto {

    @ApiProperty({
        description: 'Payment response status',
        example: 'true',
    })
    success!: boolean;

    @ApiProperty({
        description: 'Payment response data',
        type: PaymentResponseDto,
    })
    data!: PaymentResponseDto;

    @ApiProperty({
        description: 'Payment response optional message',
        example: 'Payment retrieved successfully',
        required: false,
    })
    message?: string;

}




