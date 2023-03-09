import { Injectable } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

import { PrismaError } from '../utils/prisma/prisma-error'
import { PrismaService } from '../utils/prisma/prisma.service'
import { CreateQuoteDto } from './dto/create-quote.dto'
import { UpdateQuoteDto } from './dto/update-quote.dto'
import { QuoteNotFoundException } from './quoteNotFound.exception'

@Injectable()
export class QuotesService {
  constructor(private prismaService: PrismaService) {}

  async create(createQuoteDto: CreateQuoteDto) {
    const newQuote = await this.prismaService.quote.create({
      data: createQuoteDto,
    })
    return { data: newQuote }
  }

  async findAll() {
    const data = await this.prismaService.quote.findMany()
    return { data }
  }

  async findOne(id: number) {
    const quote = await this.prismaService.quote.findUnique({
      where: { id },
    })
    if (!quote) throw new QuoteNotFoundException(id)

    return { data: quote }
  }

  async update(id: number, updateQuoteDto: UpdateQuoteDto) {
    try {
      return await this.prismaService.quote.update({
        data: {
          ...updateQuoteDto,
          id: undefined,
        },
        where: { id },
      })
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new QuoteNotFoundException(id)
      }
      throw error
    }
  }

  async remove(id: number) {
    try {
      const item = await this.prismaService.quote.delete({
        where: { id },
      })
      return {
        message: 'Deleted',
        data: item,
      }
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new QuoteNotFoundException(id)
      }
      throw error
    }
  }
}
