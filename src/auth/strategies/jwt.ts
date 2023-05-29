import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { Repository } from 'typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { JwtPayload } from 'src/interfaces/jwt-payload'
import { User } from '../entities/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    consigService: ConfigService
  ) {
    // en este caso, es necesario hacer llamado del constructor padre
    super({
      secretOrKey: consigService.get('JWT_SECRET'),
      // obteniendo el token desde el header auth como bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload
    const user = await this.userRepository.findOneBy({ email })

    if (!user || !user.isActive)
      throw new UnauthorizedException('Hubo un problema al iniciar sesión')

    // se añade a la request
    return user
  }
}
