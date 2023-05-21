import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Product } from './product.entity'

@Entity({ name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number

  @Column('text')
  url: string

  @ManyToOne(() => Product, (product) => product.images, {
    // en caso de eliminar el product, toda la relacion con sus images es eliminada en cascada
    onDelete: 'CASCADE'
  })
  product: Product
}
