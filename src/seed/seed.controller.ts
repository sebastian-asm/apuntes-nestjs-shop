import { Controller, Get } from '@nestjs/common'

import { SeedService } from './seed.service'

@Controller('seed')
export class SeedController {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly seedService: SeedService) {}

  @Get()
  executeSeed() {
    return this.seedService.runSeed()
  }
}
