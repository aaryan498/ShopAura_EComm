import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreatePaymentIntentDto {

    @ApiProperty({
        description: 'Order ID',
        example: '12kdbvkbzdkv-kshvdvhskh-2sdbsdbdbs',
    })
    @IsNotEmpty({ message: 'Order ID is required' })
    @IsString({ message: 'Order ID must be a string' })
    orderId!: string;

    @ApiProperty({
        description: 'Payment amount',
        example: '199.99',
    })
    @IsNotEmpty({ message: 'Payment amount is required' })
    @IsNumber({}, { message: 'Payment amount must be a number' })
    amount!: number;

    @ApiProperty({
        description: 'Payment currency',
        example: 'USD',
        default: 'usd',
        required: false,
    })
    @IsString({ message: 'Payment currency must be a string' })
    @IsOptional()
    currency?: string = 'usd';

    @ApiProperty({
        description: 'Payment description',
        example: 'Payment for order 12kdbvkbzdkv-kshvdvhskh-2sdbsdbdbs',
        required: false,
    })
    @IsString({ message: 'Payment description must be a string' })
    @IsOptional()
    description?: string;

}