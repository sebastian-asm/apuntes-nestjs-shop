import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

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
      const user = this.userRepository.create(createUserDto)
      await this.userRepository.save(user)
      return user
    } catch (error) {
      this.handleErrors(error)
    }
  }
}
