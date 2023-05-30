import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthService } from './auth.service'
import { CreateUserDto, LoginUserDto } from './dto'
import { GetUser } from './decorators/get-user'
import { User } from './entities/user.entity'

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

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // decorador personalizado
    @GetUser() user: User
  ) {
    return user
  }
}
