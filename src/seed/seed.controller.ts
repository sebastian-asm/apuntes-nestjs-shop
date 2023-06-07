import { Controller, Get } from '@nestjs/common'

import { Auth } from 'src/auth/decorators'
import { SeedService } from './seed.service'
import { ValidRoles } from 'src/interfaces'

@Controller('seed')
export class SeedController {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(ValidRoles.ADMIN)
  executeSeed() {
    return this.seedService.runSeed()
  }
}
