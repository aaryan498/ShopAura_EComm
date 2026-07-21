import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";


export class UpdateUserDto {

    @ApiProperty({ description: 'User first name', example: 'John', required: false })
    @IsOptional()
    @IsString({message: "First name must be a string"})
    @MaxLength(50, {message: "First name must be less than 50 characters"})
    firstName? : string;

    @ApiProperty({ description: 'User middle name', example: 'Kum', required: false })
    @IsOptional()
    @IsString({message: "Middle name must be a string"})
    @MaxLength(50, {message: "Middle name must be less than 50 characters"})
    middleName? : string | null;

    @ApiProperty({ description: 'User last name', example: 'Doe', required: false })
    @IsOptional()
    @IsString({message: "Last name must be a string"})
    @MaxLength(50, {message: "Last name must be less than 50 characters"})
    lastName? : string;

    @ApiProperty({ description: 'User email', example: 'you@mail.com', required: false })
    @IsOptional()
    @IsEmail({},{message: "Email must be a valid email"})
    @MaxLength(50, {message: "Email must be less than 50 characters"})
    email? : string;
  
}