import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'
import { Socket } from 'socket.io'

import { User } from 'src/auth/entities/user.entity'

interface ConnectedClients {
  [id: string]: {
    socket: Socket
    user: User
  }
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {}

  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async register(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user || !user.isActive)
      throw new Error('Error con los datos del usuario')
    this.connectedClients[client.id] = { socket: client, user }
  }

  remove(clientId: string) {
    delete this.connectedClients[clientId]
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients)
  }

  getUserFullName(socketId: string) {
    return this.connectedClients[socketId].user.fullName
  }
}
