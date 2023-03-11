import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { PrismaService } from '../utils/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'

// import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const data = await this.prismaService.users.create({
        data: { ...createUserDto, isTwoFactorAuthEnabled: false },
      })
      return data
    } catch (error) {
      console.log(error)
      throw new HttpException(
        `User with ${createUserDto.email} already exists`,
        HttpStatus.CONFLICT,
      )
    }
  }

  async getByEmail(email: string) {
    try {
      const data = await this.prismaService.users.findUnique({
        where: { email },
      })
      if (!data) {
        throw new HttpException(`User with ${email} does not exist`, HttpStatus.NOT_FOUND)
      }

      return data
    } catch (error) {
      throw new HttpException('Error: Not found', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getById(id: string) {
    const data = await this.prismaService.users.findUnique({
      where: { id },
    })
    return data
  }

  // async findAll() {
  //   return `This action returns all users`
  // }

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`
  // }

  // async remove(id: number) {
  //   return `This action removes a #${id} user`
  // }

  async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    await this.prismaService.users.update({
      data: {
        // With Prisma when a field is assigned undefined it means ignore this and do nothing for this field.
        id: undefined,
        email: undefined,
        name: undefined,
        password: undefined,
        isTwoFactorAuthEnabled: undefined,
        twoFactorAuthSecret: secret,
      },
      where: { id: userId },
    })
  }

  async turnOnTwoFactorAuthentication(userId: string) {
    try {
      await this.prismaService.users.update({
        data: {
          // With Prisma when a field is assigned undefined it means ignore this and do nothing for this field.
          id: undefined,
          email: undefined,
          name: undefined,
          password: undefined,
          isTwoFactorAuthEnabled: true,
        },
        where: { id: userId },
      })
      return { message: 'TwoFactor Authentication is not turned on' }
    } catch (error) {
      throw error
    }
  }
}
