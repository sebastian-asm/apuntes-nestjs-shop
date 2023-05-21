import { Injectable } from '@nestjs/common'

import { ProductsService } from '../products/products.service'
import { initialData } from './data/seed-data'

@Injectable()
export class SeedService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly productService: ProductsService) {}

  private async insertNewProducts() {
    await this.productService.deleteAllProducts()
    const products = initialData.products
    const insertPromises = []

    products.forEach((product) =>
      insertPromises.push(this.productService.create(product))
    )

    await Promise.all(insertPromises)
    return true
  }

  async runSeed() {
    this.insertNewProducts()
    return { message: 'Run seed' }
  }
}
