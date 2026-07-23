import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";


export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export class QueryOrderDto {

    @ApiProperty({
        description: 'Page for pagination',
        example: 1,
        minimum: 1,
        default: 1,
    })
    @Min(1)
    @IsOptional()
    @Type(()=> Number)
    @IsNumber()
    page : number = 1;


    @ApiProperty({
        description: 'Limit for each page',
        example: 20,
        minimum: 1,
        default: 10,
    })
    @Min(1)
    @IsOptional()
    @Type(()=>Number)
    @IsNumber()
    limit : number = 10;


    @IsOptional()
    @IsNumber()
    // @IsString()
    status? : OrderStatus;


    @ApiProperty({
        description: 'Filter using search keywords',
        example: 'Headphones',
        required: false
    })
    @IsOptional()
    @IsString()
    search? : string;
}