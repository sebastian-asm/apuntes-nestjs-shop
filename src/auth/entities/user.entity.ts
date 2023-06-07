import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

import { Product } from 'src/products/entities'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { unique: true })
  email: string

  @Column('text', { select: false })
  password: string

  @Column('text')
  fullName: string

  @Column('bool', { default: true })
  isActive: boolean

  @Column('text', {
    array: true,
    default: ['user']
  })
  roles: string[]

  // relacionando un usuario con multiples productos
  @OneToMany(() => Product, (product) => product.user)
  product: Product

  // pasado a minusculas el email al crear nuevo registro o actualizar
  @BeforeInsert()
  emailLowerCase() {
    this.email = this.email.trim().toLowerCase()
  }

  @BeforeUpdate()
  updatEmailLowerCase() {
    this.emailLowerCase()
  }
}
