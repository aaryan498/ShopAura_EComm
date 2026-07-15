import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Role } from 'src/generated/prisma/enums';


// DTO for register Data coming from frontend
export class RegisterDto {

    @ApiProperty({
        description: "User first name",
        example: "John",
        required: true
    })
    @IsNotEmpty({message: "First name is required"})
    @IsString({message: "First name must be a string"})
    @MaxLength(50, {message: "First name must be less than 50 characters"})
    firstName! : string;

    @ApiProperty({
        description: "User middle name",
        example: "Doe",
        required: false
    })
    @IsOptional()
    @IsString({message: "Middle name must be a string"})
    @MaxLength(50, {message: "Middle name must be less than 50 characters"})
    middleName! : string | null;

    @ApiProperty({
        description: "User last name",
        example: "Doe",
        required: true
    })
    @IsNotEmpty({message: "Last name is required"})
    @IsString({message: "Last name must be a string"})
    @MaxLength(50, {message: "First name must be less than 50 characters"})
    lastName! : string;


    @ApiProperty({
        description: "User email",
        example: "your-email@domain.com",
        required: true
    })
    @IsNotEmpty({message: "Email is required"})
    @IsEmail({}, {message: "Email is not valid"})
    email! : string;

    @ApiProperty({
        description: "User password",
        example: "Str0ngP@ssw0rd!",
        required: true
    })
    @IsNotEmpty({message: "Password is required"})
    @IsString({message: "Password must be a string"})
    @MinLength(8, {message: "Password must be at least 8 characters long"})
    @MaxLength(50, {message: "Password must be less than 50 characters"})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: "Password must contain one uppercase letter, one lowercase letter, one number and one special character"
    })
    password! : string;

    role! : Role;
}