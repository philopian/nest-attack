import { NotFoundException } from '@nestjs/common'

export class QuoteNotFoundException extends NotFoundException {
  constructor(quoteId: number) {
    super(`Quote with id ${quoteId} not found`)
  }
}
