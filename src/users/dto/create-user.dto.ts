import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateUserDto {
  @Length(3)
  @IsNotEmpty()
  @IsString()
  name: string

  @Length(3)
  @IsNotEmpty()
  @IsString()
  email: string

  @IsNotEmpty()
  @Length(3, 30)
  @IsString()
  password: string
}
