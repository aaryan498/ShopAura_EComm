import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {

    private readonly SALT_ROUNDS = 15;


    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    // NOTE: Shifted to any right now, move back to AuthResponseDto when return works.
    async register(registerDto: RegisterDto): Promise<any> {
        const { firstName, middleName, lastName, email, password, role } = registerDto;

        const existingUser = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if (existingUser) {
            throw new ConflictException("User already registered with this email");
        }

        try {

            const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

            const user = await this.prisma.user.create({
                data: {
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


            const tokens = await this.generateTokens(user.id, user.email, user.role);
            await this.updateRefreshTokens(user.id, tokens.refreshToken);

            return {
                user,
                ...tokens
            }

        } catch (error) {
            console.error("Error registering user:", error);
            throw new InternalServerErrorException("Error registering user");
        }
    }


    async generateTokens(userId: string, email: string, role: string): Promise<{ accessToken: string, refreshToken: string }> {
        const payload = {
            sub: userId,
            email,
            role
        }
        const refreshId = randomBytes(16).toString('hex');

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: '15m'
            }),
            this.jwtService.signAsync({ ...payload, refreshId }, {
                expiresIn: '7d'
            })
        ])

        return {
            accessToken,
            refreshToken
        }

    }


    async updateRefreshTokens(userId: string, refreshToken: string): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken
            }
        })
    }

}
