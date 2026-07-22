import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";


export class CreateProductDto {

    @ApiProperty({ description: 'Product Name', example: 'Wireless Earphone', maxLength: 150 })
    @IsNotEmpty({ message: 'Product Name is required'})
    @IsString({ message: 'Product Name must be a string'})
    @MaxLength(150, { message: 'Product Name must be less than 150 characters'})
    name! : string;

    @ApiProperty({ description: 'Product Description', example: 'Wireless Earphone with 10 hours of battery life' })
    @IsOptional()
    @IsString({ message: 'Product Description must be a string'})
    @MaxLength(400, { message: 'Product Description must be less than 400 characters'})
    description? : string;


    @ApiProperty({ description: 'Product Price in USD', example: 100.99, minimum: 0 })
    @IsNotEmpty({ message: 'Product Price is required'})
    @Min(0, { message: 'Product Price must be greater than 0'})
    @Type(() => Number)
    @IsNumber({
        maxDecimalPlaces: 2
    }, { message: 'Product Price must be a number'})
    price! : number;


    @ApiProperty({ description: 'Product Stock', example: 100, minimum: 0 })
    @IsNotEmpty({ message: 'Product Stock is required'})
    @Min(0, { message: 'Product Stock must be greater than 0'})
    @Type(() => Number)
    @IsInt({ message: 'Product Stock must be a integer'})
    stock! : number;


    @ApiProperty({ description: 'Product Image URL', example: 'https://example.com/image.jpg' })
    @IsOptional()
    @IsString({ message: 'Product Image URL must be a string'})
    @MaxLength(200, { message: 'Product Image URL must be less than 200 characters'})
    imageUrl? : string;


    @ApiProperty({ description: 'Product SKU (Stock Keeping Unit)', example: 'ABC123' })
    @IsNotEmpty({ message: 'Product SKU is required'})
    @IsString({ message: 'Product SKU must be a string'})
    @MaxLength(50, { message: 'Product SKU must be less than 50 characters'})
    sku! : string;

    @ApiProperty({ description: 'Product Category', example: 'Electronics' })
    @IsNotEmpty({ message: 'Product Category is required'})
    @IsString({ message: 'Product Category must be a string'})
    @MaxLength(50, { message: 'Product Category must be less than 50 characters'})
    categoryId! : string;


    @ApiProperty({ description: 'Whether product is active and available for purchase', example: true, default: true })
    @IsBoolean({ message: 'Product status must be a boolean'})
    isActive? : boolean;

}