import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { initialData } from './data/seed-data'
import { ProductsService } from '../products/products.service'
import { User } from 'src/auth/entities/user.entity'

@Injectable()
export class SeedService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  private async insertNewProducts(user: User) {
    await this.productService.deleteAllProducts()
    const { products } = initialData
    const insertPromises = []

    products.forEach((product) =>
      insertPromises.push(this.productService.create(product, user))
    )

    await Promise.all(insertPromises)
    return true
  }

  private async insertUsers() {
    const seedUsers = initialData.users
    const users: User[] = []
    seedUsers.forEach((user) => users.push(this.userRepository.create(user)))
    const dbUsers = await this.userRepository.save(seedUsers)
    // retornando el primer usuario que es admin
    return dbUsers[0]
  }

  private async deleteTables() {
    // purgando todas las tablas de manera ordenada (por las relaciones existentes)
    await this.productService.deleteAllProducts()
    const queryBuilder = this.userRepository.createQueryBuilder()
    await queryBuilder.delete().where({}).execute()
  }

  async runSeed() {
    this.deleteTables()
    const adminUser = await this.insertUsers()
    this.insertNewProducts(adminUser)
    return { message: 'Run seed' }
  }
}
