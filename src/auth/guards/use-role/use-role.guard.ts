import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { Observable } from 'rxjs'

import { META_ROLES } from 'src/auth/decorators/role-protected/role-protected.decorator'
import { User } from 'src/auth/entities/user.entity'

@Injectable()
export class UseRoleGuard implements CanActivate {
  // permite ver info de los decoradores
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler()
    )
    // obteniendo el usuario de la request
    const req = context.switchToHttp().getRequest()
    const user = req.user as User
    if (!user) throw new BadRequestException('Usuario no encontrado')

    for (const role of user.roles) {
      if (validRoles.includes(role)) return true
    }

    throw new ForbiddenException(
      `El usuario ${user.fullName} no tiene los permisos necesarios`
    )
  }
}
