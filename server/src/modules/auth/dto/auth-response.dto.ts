import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/generated/prisma/enums";


export class AuthResponseDto {

    @ApiProperty({
        description: "Access token for authentication",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lI",
        required: true
    })
    accessToken! : string;

    @ApiProperty({
        description: "Refresh token for authentication",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lI",
        required: true
    })
    refreshToken! : string;

    @ApiProperty({
        description: "Authenticated User data",
        example: {
            id: "123",
            firstName: "John",
            middleName: "Doe",
            lastName: "Doe",
            email: "your@email.com",
            role: "ADMIN"
        },
        required: true
    })
    user! : {
        id : string;
        firstName : string;
        middleName : string | null;
        lastName : string;
        email : string;
        role : Role;
    }

}