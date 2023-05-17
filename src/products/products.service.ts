import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'
import { validate as isUUID } from 'uuid'

import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Product, ProductImage } from './entities'
import { PaginationDto } from 'src/common/dtos/pagination.dto'

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService')

  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // se crear el registro en memoria
      const { images = [], ...productDetails } = createProductDto
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image })
        )
      })

      // se guarda en la db
      await this.productRepository.save(product)
      return { ...product, images }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    try {
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
      })

      // devolviendo el product pero solo con el url de la imagen
      return products.map((product) => ({
        ...product,
        images: product.images.map((img) => img.url)
      }))
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findOne(query: string) {
    let product: Product
    try {
      if (isUUID(query)) {
        product = await this.productRepository.findOneBy({ id: query })
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder('prod')
        // construccion de query más avanzada (evitar inyeccion de dependencia)
        product = await queryBuilder
          .where('UPPER(title)=:title or slug=:slug', {
            title: query.toUpperCase(),
            slug: query.toLowerCase()
          })
          .leftJoinAndSelect('prod.images', 'prodImages')
          .getOne()
      }

      if (!product) throw new NotFoundException('Product not found')
      return product
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findOnePlain(query: string) {
    const { images = [], ...rest } = await this.findOne(query)
    return {
      ...rest,
      images: images.map((img) => img.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      // preparando para la actualización
      const product = await this.productRepository.preload({
        id,
        ...updateProductDto,
        images: []
      })

      if (!product) throw new NotFoundException('Product not found')
      await this.productRepository.save(product)
      return product
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id)
      return await this.productRepository.remove(product)
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    } else {
      this.logger.error(error)
      throw new InternalServerErrorException(
        error.message || 'Unexpected error'
      )
    }
  }
}
