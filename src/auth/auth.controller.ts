import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards
  // SetMetadata
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { CreateUserDto, LoginUserDto } from './dto'
import { GetUser, RawHeaders, Auth } from './decorators'
import { RoleProtected } from './decorators/role-protected.decorator'
import { User } from './entities/user.entity'
import { UseRoleGuard } from './guards/use-role/use-role.guard'
import { ValidRoles } from 'src/interfaces'

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto)
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user)
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // decorador personalizado
    @GetUser() user: User,
    @GetUser('email') email: User,
    @RawHeaders() rawHeaders: string[]
    // @Headers() headers: IncomingHttpHeaders
  ) {
    return {
      user,
      email,
      rawHeaders
    }
  }

  @Get('private2')
  @RoleProtected(ValidRoles.SUPER_USER, ValidRoles.ADMIN)
  // @SetMetadata('roles', ['admin', 'super-user'])
  // guard personalizado no son necesario ejecutarlo como funcion(), solo se pasa la referencia
  @UseGuards(AuthGuard(), UseRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      user
    }
  }

  @Get('private3')
  @Auth(ValidRoles.ADMIN)
  privateRoute3(@GetUser() user: User) {
    return {
      user
    }
  }
}
