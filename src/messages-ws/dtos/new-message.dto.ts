import { IsString } from 'class-validator'

export class NewMessageDto {
  @IsString()
  message: string
}
