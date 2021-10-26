import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: ['http://nats-clusterip-srv:4222'],
      queue: 'TICKET_QUEUE',
      manualAckMode: true,
    },
  });
  await app.startAllMicroservices();
  await app.listen(3333, () =>
    Logger.log(`Listening on port ${3333}`, 'Ticket Service'),
  );
}
bootstrap();
