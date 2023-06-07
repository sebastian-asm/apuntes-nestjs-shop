import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { DataSource, Repository } from 'typeorm'
import { validate as isUUID } from 'uuid'

import { CreateProductDto } from './dto/create-product.dto'
import { PaginationDto } from 'src/common/dtos/pagination.dto'
import { Product, ProductImage } from './entities'
import { UpdateProductDto } from './dto/update-product.dto'
import { User } from 'src/auth/entities/user.entity'

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService')

  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    // referencia a la cadena de conexión
    private readonly dataSource: DataSource
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      // se crear el registro en memoria
      const { images = [], ...productDetails } = createProductDto
      const product = this.productRepository.create({
        ...productDetails,
        user,
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

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...toUpdate } = updateProductDto

    // query runner: permite ejecutar multiples queries y en caso de error hacer rollback
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // preparando para la actualización
      const product = await this.productRepository.preload({ id, ...toUpdate })
      if (!product) throw new NotFoundException('Product not found')

      // en caso de existir imagenes, eliminar solo las anteriores que corresponde al id del product
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: id })
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image })
        )
      }

      product.user = user
      // guardando en memoria la actualuzación (no impacta la db)
      await queryRunner.manager.save(product)
      // el commit realmente guarda en la db
      await queryRunner.commitTransaction()
      await queryRunner.release()

      return this.findOnePlain(id)
    } catch (error) {
      // en caso de cualquier error con el delete o save se hace el rollback
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      this.handleDBExceptions(error)
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id)
      await this.productRepository.remove(product)
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

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product')
    try {
      return await query.delete().where({}).execute()
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
}
