import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    private readonly SALT_ROUNDS = 15;


    constructor(private prisma : PrismaService) {}

    // NOTE: Shifted to any right now, move back to AuthResponseDto when return works.
    async register(registerDto : RegisterDto) : Promise<any> {
        const { firstName, middleName, lastName, email, password, role } = registerDto;

        const existingUser = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(existingUser){
            throw new ConflictException("User already registered with this email");
        }

        try {

            const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

            const user = await this.prisma.user.create({
                data : {
                    firstName,
                    middleName,
                    lastName,
                    email,
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    firstName: true,
                    middleName: true,
                    lastName: true,
                    email: true,
                    role: true,
                    password: false
                }
            })


            // const tokens = await this.generateTokens(user.id, user.email, user.role);
            
        } catch (error) {
            
        }
    }

}
