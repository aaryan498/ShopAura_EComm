import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/generated/prisma/enums";
import { NullsOrder } from "src/generated/prisma/internal/prismaNamespace";


export class UserResponseDto {

    @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-4266' })
    id! : string;



    @ApiProperty({ description: 'User first name', example: 'John'})
    firstName! : string;

    @ApiProperty({ description: 'User middle name', example: 'Doe', nullable: true })
    middleName! : string | null;

    @ApiProperty({ description: 'User last name', example: 'Doe'})
    lastName! : string;



    @ApiProperty({ description: 'User email', example: 'you@mail.com'})
    email! : string;

    @ApiProperty({ description: 'User role', enum: Role, example: 'ADMIN'})
    role! : Role;


    @ApiProperty({ description: 'Account Creation Date', example: '2023-01-01T00:00:00.000Z' })
    createdAt! : Date;

    @ApiProperty({ description: 'Account Update Date', example: '2023-01-01T00:00:00.000Z' })
    updatedAt! : Date;

    
}