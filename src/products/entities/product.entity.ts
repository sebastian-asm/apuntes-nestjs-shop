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
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', {
    unique: true
  })
  title: string

  @Column('float', {
    default: 0
  })
  price: number

  @Column({
    type: 'text',
    nullable: true
  })
  description: string

  @Column('text', {
    unique: true
  })
  slug: string

  @Column('int', {
    default: 0
  })
  stock: number

  @Column('text', {
    array: true
  })
  sizes: string[]

  @Column('text')
  gender: string

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
