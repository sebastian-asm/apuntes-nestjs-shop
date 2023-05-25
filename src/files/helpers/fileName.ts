import { Express, Request } from 'express'
import { v4 as uuid } from 'uuid'

export const fileName = (
  req: Request,
  file: Express.Multer.File,
  cb: Function
) => {
  const fileExtension = file.mimetype.split('/')[1]
  const fileName = `${uuid()}.${fileExtension}`
  cb(null, fileName)
}
