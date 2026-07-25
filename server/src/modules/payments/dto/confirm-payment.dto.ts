import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";



export class ConfirmPaymentDto{

    @ApiProperty({
        description: 'Payment intent ID',
        example: 'pi_3P9f1qKZB2Zvcoi600eF4q3z',
    })
    @IsNotEmpty()
    @IsString()
    paymentIntentId!: string;

    @ApiProperty({
        description: 'Order ID',
        example: '12kdbvkbzdkv-kshvdvhskh-2sdbsdbdbs',
    })
    @IsNotEmpty()
    @IsString()
    orderId!: string;
}