import { Express, Request } from 'express'

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: Function
) => {
  if (!file) return cb(new Error('Falta un archivo para subir'), false)

  const fileExtension = file.mimetype.split('/')[1]
  const validExtensions = ['jpg', 'jpeg', 'png']

  if (!validExtensions.includes(fileExtension)) return cb(null, false)
  cb(null, true)
}
