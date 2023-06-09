// import { PartialType } from '@nestjs/mapped-types'
// importarlo desde swagger para obtener todos los decoradores para la documentacion
import { PartialType } from '@nestjs/swagger'

import { CreateProductDto } from './create-product.dto'

export class UpdateProductDto extends PartialType(CreateProductDto) {}
