import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ApiTags, ApiParam } from '@nestjs/swagger'

import { CreateQuoteDto } from './dto/create-quote.dto'
import { UpdateQuoteDto } from './dto/update-quote.dto'
import { QuotesService } from './quotes.service'

@Controller('quotes')
@ApiTags('Quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createQuoteDto: CreateQuoteDto) {
    return this.quotesService.create(createQuoteDto)
  }

  @Get()
  findAll() {
    return this.quotesService.findAll()
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a quote that exists in the database',
    type: Number,
  })
  findOne(@Param('id') id: string) {
    return this.quotesService.findOne(+id)
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a quote that exists in the database',
    type: Number,
  })
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateQuoteDto: UpdateQuoteDto) {
    return this.quotesService.update(+id, updateQuoteDto)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a quote that you want to delete from the database',
    type: Number,
  })
  remove(@Param('id') id: string) {
    return this.quotesService.remove(+id)
  }
}
