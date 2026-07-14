import { Role } from "src/generated/prisma/enums";


export class AuthResponseDto {


    accessToken! : string;


    refreshToken! : string;


    user! : {
        id : string;
        firstName : string;
        middleName? : string;
        lastName : string;
        email : string;
        role : Role;
    }

}