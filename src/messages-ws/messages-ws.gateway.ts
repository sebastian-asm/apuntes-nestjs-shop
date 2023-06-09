import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway
} from '@nestjs/websockets'

import { Socket } from 'socket.io'

import { MessagesWsService } from './messages-ws.service'

@WebSocketGateway({ cors: true })
// implementaciones que permiten saber cuando un cliente se conecta o desconecta
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    console.log('cliente conectado', client.id)
  }

  handleDisconnect(client: Socket) {
    console.log('cliente desconectado', client.id)
  }
}
