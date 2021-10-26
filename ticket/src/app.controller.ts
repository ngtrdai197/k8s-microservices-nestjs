import { Controller, Get, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  NatsContext,
  Payload,
} from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';
import { TICKET_SERVICE } from './nats/nats.module';

@Controller()
export class AppController {
  constructor(@Inject(TICKET_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  public async getHello() {
    return lastValueFrom(
      this.client.send({ cmd: 'GET_MSG_FROM_ORDER' }, {}).pipe(
        map((response) => {
          return {
            ...response,
            additionalData: 'TICKET_SERVICE',
          };
        }),
      ),
    );
  }

  @MessagePattern({ cmd: 'GET_MY_NAME' })
  public async getName(@Payload() data: string, @Ctx() context: NatsContext) {
    return new Promise<string>((resolve, _) => {
      setTimeout(() => {
        resolve(data + ' Dep zai 🚀');
      }, 0);
    });
  }
}
