import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { CreateProductDto } from './dto/create-product.dto'
// import { UpdateProductDto } from './dto/update-product.dto'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService')

  // eslint-disable-next-line no-useless-constructor
  constructor (
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async create (createProductDto: CreateProductDto) {
    try {
      // se crear el registro en memoria
      const product = this.productRepository.create(createProductDto)
      // se guarda en la db
      await this.productRepository.save(product)
      return product
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll () {
    try {
      const products = await this.productRepository.find()
      return products
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findOne (id: string) {
    try {
      const product = await this.productRepository.findOneBy({ id })
      if (!product) throw new NotFoundException('Product not found')
      return product
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  // update (id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`
  // }

  async remove (id: string) {
    try {
      const product = await this.findOne(id)
      return await this.productRepository.remove(product)
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  private handleDBExceptions (error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    } else {
      this.logger.error(error)
      throw new InternalServerErrorException(error.message || 'Unexpected error')
    }
  }
}
