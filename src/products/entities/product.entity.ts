import { ApiProperty } from '@nestjs/swagger'

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

import { ProductImage } from './product-image.entity'
import { User } from 'src/auth/entities/user.entity'

// asignando nombre a la tabla en la db
@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '3fe05a58-623e-4fbc-85e3-2270ee4b389f',
    description: 'Id del producto',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({
    example: 'Men’s 3D Small Wordmark Tee',
    description: 'Título del producto',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  title: string

  @ApiProperty({
    example: 0,
    description: 'Precio del producto'
  })
  @Column('float', {
    default: 0
  })
  price: number

  @ApiProperty({
    example: 'Designed for comfort and style in any size...',
    description: 'Descripción del producto',
    default: null
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string

  @ApiProperty({
    example: 'men_3d_small_wordmark_tee',
    description: 'Slug para SEO del producto',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  slug: string

  @ApiProperty({
    example: 10,
    description: 'Cantidad disponible del producto',
    default: 0
  })
  @Column('int', {
    default: 0
  })
  stock: number

  @ApiProperty({
    example: ['XS', 'S', 'M'],
    description: 'Tamaños disponibles del producto'
  })
  @Column('text', {
    array: true
  })
  sizes: string[]

  @ApiProperty({
    example: 'men',
    description: 'Género del producto'
  })
  @Column('text')
  gender: string

  @ApiProperty()
  @Column('text', {
    array: true,
    default: []
  })
  tags: string[]

  // multiples productos tienen un unico usuario que los crea
  @ManyToOne(
    // entidad con la que se relaciona
    () => User,
    // como el usuario se relacion con esta tabla
    (user) => user.product,
    // cargar automaticamente la relacion para enviarla como respuesta
    { eager: true }
  )
  user: User

  // un producto puede tener multiples imagenes
  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true
  })
  images?: ProductImage[]

  // condicional para antes de insertar en db
  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) this.slug = this.title
    this.slug = this.slug.toLowerCase().replaceAll(' ', '-').replaceAll("'", '')
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug.toLowerCase().replaceAll(' ', '-').replaceAll("'", '')
  }
}
