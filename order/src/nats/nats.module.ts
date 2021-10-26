import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const ORDER_SERVICE = Symbol('ORDER_SERVICE');

@Module({
  providers: [
    {
      provide: ORDER_SERVICE,
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.NATS,
          options: {
            servers: ['http://nats-clusterip-srv:4222'],
            queue: 'ORDER_QUEUE',
            debug: true
          },
        }),
    },
  ],
  exports: [ORDER_SERVICE],
})
export class NatsModule {}
