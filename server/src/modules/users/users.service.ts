import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';


@Injectable()
export class UsersService {

    private readonly SALT_ROUNDS = 15;

    constructor( private prisma : PrismaService ) {}

    async findOne(userId : string) : Promise<UserResponseDto> {

        const user = await this.prisma.user.findUnique({
            where : { id : userId },
            select : {
                id : true,
                firstName : true,
                middleName : true,
                lastName : true,
                email : true,
                role : true,
                createdAt : true,
                updatedAt : true,
                password : false
            }
        })

        if(!user) throw new NotFoundException('User Not Found !');

        return user;

    }

    async findAll() : Promise<UserResponseDto[]> {
        return await this.prisma.user.findMany({
            select: {
                id : true,
                firstName : true,
                middleName : true,
                lastName : true,
                email : true,
                role : true,
                createdAt : true,
                updatedAt : true,
                password : false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async updateUser(userId : string, updateUserDto : UpdateUserDto) : Promise<UserResponseDto> {
        const existingUser = await this.prisma.user.findUnique({
            where : { id : userId }
        });

        if(!existingUser) throw new NotFoundException('User Not Found !');

        if(updateUserDto.email && existingUser.email !== updateUserDto.email) {
            const emailTaken = await this.prisma.user.findUnique({
                where: {email : updateUserDto.email}
            })
            if(emailTaken) throw new ConflictException('Email Already in use !');
        }

        const updatedUser = await this.prisma.user.update({
            where : { id : userId },
            data : updateUserDto,
            select : {
                id : true,
                firstName : true,
                middleName : true,
                lastName : true,
                email : true,
                role : true,
                createdAt : true,
                updatedAt : true,
                password : false
            }
        })

        return updatedUser;
    }

    async changePassword(userId : string, changePasswordDto : ChangePasswordDto) : Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
            where : { id : userId },
            select : { password : true },
        })

        if(!user) throw new NotFoundException('User not found !');

        const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
        if(!isPasswordValid) throw new UnauthorizedException('Current password is incorrect !');

        const isSamePassword = await bcrypt.compare(changePasswordDto.newPassword, user.password);
        if(isSamePassword) throw new ConflictException('Current password and new password cannot match !');

        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, this.SALT_ROUNDS);

        await this.prisma.user.update({
            where : { id : userId },
            data : { password : hashedPassword }
        })

        return { message : 'Password changed successfully !' };
        
    }

    async remove(userId : string) {
        const user = await this.prisma.user.findUnique({
            where: {id : userId}
        })

        if(!user) throw new NotFoundException('User not found !');

        await this.prisma.user.delete({
            where : { id : userId }
        })

        return { message : 'User deleted successfully !' };
    }
        

}
