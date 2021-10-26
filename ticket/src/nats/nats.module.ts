import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const TICKET_SERVICE = Symbol('TICKET_SERVICE');

@Module({
  providers: [
    {
      provide: TICKET_SERVICE,
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.NATS,
          options: {
            servers: ['http://nats-clusterip-srv:4222'],
            queue: 'TICKET_QUEUE',
            manualAckMode: true,
          },
        }),
    },
  ],
  exports: [TICKET_SERVICE],
})
export class NatsModule {}
