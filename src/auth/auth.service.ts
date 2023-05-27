import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'
import { hashSync } from 'bcrypt'

import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class AuthService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  private handleErrors(error: any): never {
    console.log(error)
    if (error.code === '23505') throw new BadRequestException(error.detail)
    throw new InternalServerErrorException('Ocurrió un error inesperado')
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto
      const user = this.userRepository.create({
        ...userData,
        password: hashSync(password, 10)
      })

      await this.userRepository.save(user)
      delete user.password

      return user
    } catch (error) {
      this.handleErrors(error)
    }
  }
}
