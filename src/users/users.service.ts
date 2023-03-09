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
        data: createUserDto,
      })
      delete data.password
      return { data }
    } catch (error) {
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
      delete data.password
      return { data }
    } catch (error) {
      throw new HttpException('Error: Not found', HttpStatus.INTERNAL_SERVER_ERROR)
    }
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
}
