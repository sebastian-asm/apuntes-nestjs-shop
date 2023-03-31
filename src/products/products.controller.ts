import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query
} from '@nestjs/common'

import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { PaginationDto } from 'src/common/dtos/pagination.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Controller('products')
export class ProductsController {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly productsService: ProductsService) {}

  @Post()
  create (@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @Get()
  findAll (@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto)
  }

  @Get(':query')
  findOne (@Param('query') query: string) {
    return this.productsService.findOne(query)
  }

  @Patch(':id')
  update (
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, updateProductDto)
  }

  @Delete(':id')
  remove (@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id)
  }
}
