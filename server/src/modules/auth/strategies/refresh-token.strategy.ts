import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';



@Injectable()
export class RefreshTokenStrategy extends PassportStrategy( Strategy, 'jwt-refresh'){
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
        })
    }

    async validate(req: Request, payload: { sub: string, email: string, role: string }){

        console.log("RefreshTokenStrategy.validate called");
        console.log("payload: ", payload);

        const authHeader = req.headers.authorization;
        if(!authHeader){
            console.error("No Authorization Header found")
            throw new UnauthorizedException("No Authorization Header found");
        }

        const refreshToken = authHeader.replace("Bearer", "").trim();

        if(!refreshToken){
            console.error("No Refresh Token in Authorization Header found after extraction");
            throw new UnauthorizedException("No Refresh Token in Authorization Header found after extraction");
        }

        const user = await this.prisma.user.findUnique({
            where: { id : payload.sub },
            select: {
                id: true,
                email: true,
                role: true,
                refreshToken: true
            }
        });

        if(!user || !user.refreshToken){
            console.error("User not found or no refresh token found");
            throw new UnauthorizedException("User not found or no refresh token found");
        }

        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);

        if(!refreshTokenMatches){
            console.error("Refresh Token does not match");
            throw new UnauthorizedException("Refresh Token does not match");
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role
        }
    }
}