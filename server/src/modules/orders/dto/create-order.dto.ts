import { ApiProperty } from "@nestjs/swagger";

class OrderItemDto {
    @ApiProperty({})
    productId : number;

    quantity : number;
}


export class CreateOrderDto {

    orderItems : OrderItemDto[];
}