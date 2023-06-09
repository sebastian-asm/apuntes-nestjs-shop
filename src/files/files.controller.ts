import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'

import { Express, Response } from 'express'
import { diskStorage } from 'multer'

import { fileFilter, fileName } from './helpers'
import { FilesService } from './files.service'

@ApiTags('Archivos')
@Controller('files')
export class FilesController {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      storage: diskStorage({
        destination: './static/products',
        filename: fileName
      })
    })
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('El archivo no puede ser subido')
    const { filename } = file
    const url = this.configService.get('HOST_URL')
    const secureUrl = `${url}/files/product/${filename}`
    return { secureUrl }
  }

  @Get('product/:imageName')
  findProductImage(
    // permite personalizar la respuesta al cliente
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName)
    res.sendFile(path)
  }
}
