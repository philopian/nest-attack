import { Injectable, Logger } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

import { PrismaError } from '../utils/prisma/prisma-error'
import { PrismaService } from '../utils/prisma/prisma.service'
import { CreateQuoteDto } from './dto/create-quote.dto'
import { UpdateQuoteDto } from './dto/update-quote.dto'
import { QuoteNotFoundException } from './quoteNotFound.exception'

@Injectable()
export class QuotesService {
  private readonly logger = new Logger(QuotesService.name)

  constructor(private prismaService: PrismaService) {}

  async create(createQuoteDto: CreateQuoteDto) {
    const newQuote = await this.prismaService.quotes.create({
      data: createQuoteDto,
    })
    this.logger.log('[create]', newQuote)
    return { data: newQuote }
  }

  async findAll() {
    const data = await this.prismaService.quotes.findMany()
    this.logger.log('[findAll]', data)
    return { data }
  }

  async findOne(id: number) {
    const data = await this.prismaService.quotes.findUnique({
      where: { id },
    })
    if (!data) {
      this.logger.warn('[findOne]', ' not found')
      throw new QuoteNotFoundException(id)
    }
    this.logger.log('[findOne]', data)
    return { data }
  }

  async update(id: number, updateQuoteDto: UpdateQuoteDto) {
    try {
      const data = await this.prismaService.quotes.update({
        data: {
          ...updateQuoteDto,
          id: undefined,
        },
        where: { id },
      })
      this.logger.log('[update]', data)
      return { message: 'Updated', data }
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        this.logger.error('[update] ', id)
        throw new QuoteNotFoundException(id)
      }
      throw error
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prismaService.quotes.delete({
        where: { id },
      })
      this.logger.log('[remove]', data)
      return { message: 'Deleted', data }
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        this.logger.error('[remove] ', id)
        throw new QuoteNotFoundException(id)
      }
      throw error
    }
  }
}
