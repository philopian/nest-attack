import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty } from 'class-validator'

import { CreateQuoteDto } from './create-quote.dto'

export class UpdateQuoteDto extends PartialType(CreateQuoteDto) {
  @IsNotEmpty()
  id: number
}
