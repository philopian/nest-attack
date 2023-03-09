import {
  Controller,
  Get,
  Post,
  Body,
  Param, // Update,
  // Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'

import { CreateUserDto } from './dto/create-user.dto'
// import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.getByEmail(email)
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll()
  // }

  // @Patch(':id')
  // @UsePipes(ValidationPipe)
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id)
  // }
}
