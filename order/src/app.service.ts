import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
  RequestTimeoutException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, map, timeout } from 'rxjs';
import { ORDER_SERVICE } from './nats/nats.module';

interface IPatternSendingMessage {
  cmd: string | Symbol;
}

@Injectable()
export class AppService implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(AppService.name);
  constructor(@Inject(ORDER_SERVICE) private readonly client: ClientProxy) {}

  public async onApplicationBootstrap() {
    await this.client.connect();
  }

  public onModuleDestroy() {
    this.client.close();
  }

  public getHello(): Promise<string> {
    const pattern: IPatternSendingMessage = { cmd: 'GET_MY_NAME' };
    return lastValueFrom(
      this.client.send<string, string>(pattern, 'Dai Nguyen').pipe(
        map((response) => `Hello ${response}`),
        timeout(5000),
        catchError((error) => {
          if (error.message === 'Timeout has occurred') {
            throw new RequestTimeoutException();
          }
          throw error;
        }),
      ),
    );
  }
}
