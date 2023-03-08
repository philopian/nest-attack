import { Injectable } from '@nestjs/common'

import { CreateQuoteDto } from './dto/create-quote.dto'
import { UpdateQuoteDto } from './dto/update-quote.dto'

@Injectable()
export class QuotesService {
  private lastQuotetId = 0
  private quotes = {}

  create(createQuoteDto: CreateQuoteDto) {
    const id = ++this.lastQuotetId
    const newItem = { id, ...createQuoteDto }
    this.quotes[id] = newItem
    return { data: newItem }
  }

  findAll() {
    const data = Object.entries(this.quotes).map((item) => this.quotes[item[0]])
    return { data }
  }

  findOne(id: number) {
    const item = this.quotes[id]
    return { data: item }
  }

  update(id: number, updateQuoteDto: UpdateQuoteDto) {
    this.quotes[id] = updateQuoteDto
    return { data: this.quotes[id] }
  }

  remove(id: number) {
    const deletedItem = this.quotes[id]
    delete this.quotes[id]
    return {
      message: 'Deleted',
      data: deletedItem,
    }
  }
}
