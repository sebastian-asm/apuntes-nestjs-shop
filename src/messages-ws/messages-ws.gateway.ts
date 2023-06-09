import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'

import { MessagesWsService } from './messages-ws.service'

@WebSocketGateway({ cors: true })
// implementaciones que permiten saber cuando un cliente se conecta o desconecta
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    this.messagesWsService.register(client)
    // emitiendo informacion a todos los conectados
    this.server.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients()
    )
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.remove(client.id)
    this.server.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients()
    )
  }
}
