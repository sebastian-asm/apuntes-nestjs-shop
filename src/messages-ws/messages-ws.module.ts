import { Module } from '@nestjs/common'

import { AuthModule } from 'src/auth/auth.module'
import { MessagesWsGateway } from './messages-ws.gateway'
import { MessagesWsService } from './messages-ws.service'

@Module({
  providers: [MessagesWsGateway, MessagesWsService],
  imports: [AuthModule]
})
export class MessagesWsModule {}
