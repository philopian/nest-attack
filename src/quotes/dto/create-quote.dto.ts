import { IsNotEmpty, Length } from 'class-validator'

export class CreateQuoteDto {
  @IsNotEmpty()

  // Quote
  @Length(3)
  quote: string

  // Author
  @Length(3, 30)
  author: string
}
