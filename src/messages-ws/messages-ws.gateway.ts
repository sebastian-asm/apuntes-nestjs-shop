import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { JwtService } from '@nestjs/jwt'

import { Server, Socket } from 'socket.io'

import { MessagesWsService } from './messages-ws.service'
import { NewMessageDto } from './dtos/new-message.dto'
import { JwtPayload } from 'src/interfaces'

@WebSocketGateway({ cors: true })
// implementaciones que permiten saber cuando un cliente se conecta o desconecta
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization as string
    let payload: JwtPayload

    try {
      payload = this.jwtService.verify(token)
      await this.messagesWsService.register(client, payload.id)
      // emitiendo informacion a todos los conectados
      this.server.emit(
        'clients-updated',
        this.messagesWsService.getConnectedClients()
      )
    } catch {
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.remove(client.id)
    this.server.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients()
    )
  }

  // escuchando emiciones desde el cliente
  @SubscribeMessage('message-client')
  handleMessageClient(client: Socket, payload: NewMessageDto) {
    // emitir el mensaje a todos menos al mismo cliente que lo emitio
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'test',
    //   message: payload
    // })

    // emitiendo el mensaje a todos
    this.server.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload
    })
  }
}
