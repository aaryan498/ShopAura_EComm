import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";



export class LoginDto{

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
    password! : string;

}