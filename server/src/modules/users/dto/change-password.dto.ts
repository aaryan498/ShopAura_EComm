import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";


export class ChangePasswordDto {

    @ApiProperty({
        description: 'Current password of the user',
        example: 'OldP@ssW0rd!',
        required: true
    })
    @IsNotEmpty({message: "Current password is required"})
    @IsString({message: "Current password must be a string"})
    currentPassword! : string;

    @ApiProperty({
        description: 'New password of the user',
        example: 'NewP@ssW0rd!',
        required: true,
        minLength: 8,
    })
    @IsNotEmpty({message: "New password is required"})
    @IsString({message: "New password must be a string"})
    @MinLength(8, {message: "New password must be at least 8 characters long"})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
        {
            message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        }
    )
    newPassword! : string;

}