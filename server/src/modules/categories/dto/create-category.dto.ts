import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";



export class CreateCategoryDto {

    @ApiProperty({ description: 'Category name', example: 'Electronics', maxLength: 100, required: true})
    @IsString({message: "Category name must be a string"})
    @IsNotEmpty({message: "Category name is required"})
    @MaxLength(100, {message: "Category name must be less than 100 characters"})
    name! : string;

    @ApiProperty({ description: 'Category description', example: 'Electronics category', maxLength: 255, required: false})
    @IsOptional()
    @IsString({message: "Category description must be a string"})
    @MaxLength(255, {message: "Category description must be less than 255 characters"})
    description? : string;

    @ApiProperty({ description: 'Category slug', example: 'electronics', maxLength: 100, required: false})
    @IsOptional()
    @IsString({message: "Category slug must be a string"})
    @MaxLength(100, {message: "Category slug must be less than 100 characters"})
    slug? : string;

    @ApiProperty({ description: 'Category image', example: 'https://example.com/image.jpg', required: false})
    @IsOptional()
    @IsString({message: "Category image URL must be a string"})
    @MaxLength(255, {message: "Category image URL must be less than 255 characters"})
    imageUrl? : string;

    @ApiProperty({ description: 'Indicates if category is active', example: true, required: false, default: true})
    @IsOptional()
    @IsBoolean({message: "Category active status must be a boolean"})
    isActive? : boolean;


}