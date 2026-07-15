import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    private readonly SALT_ROUNDS = 15;


    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    

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

    async refreshTokens(userId : string) : Promise<AuthResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: {
                id : userId
            },
            select: {
                id : true,
                firstName : true,
                middleName : true,
                lastName : true,
                email : true,
                role : true,
                password : false
            }
        })
        if(!user){
            throw new NotFoundException("User Not Found");
        }

        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.updateRefreshTokens(user.id, tokens.refreshToken);

        return {
            ...tokens,
            user
        }
    }

    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
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

    async login(loginDto : LoginDto) : Promise<AuthResponseDto> {
        const { email, password } = loginDto;

        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!user){
            throw new NotFoundException('User with this email not found. Register First');
        }

        if(!(await bcrypt.compare(password, user.password))){
            throw new UnauthorizedException('Incorrect password')
        }

        const tokens = await this.generateTokens( user.id, user.email, user.role);
        await this.updateRefreshTokens(user.id, tokens.refreshToken);

        return {
            ...tokens,
            user : {
                id : user.id,
                firstName : user.firstName,
                middleName : user.middleName,
                lastName : user.lastName,
                email : user.email,
                role : user.role
            }
        }
    }

    async logout(userId : string) : Promise<void> {
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: null
            }
        })
    }
}
