import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateQuoteDto {
  @Length(3)
  @IsNotEmpty()
  @IsString()
  quote: string

  @IsNotEmpty()
  @Length(3, 30)
  @IsString()
  author: string
}
