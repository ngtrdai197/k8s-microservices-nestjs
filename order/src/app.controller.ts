import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'GET_MSG_FROM_ORDER' })
  public getDummyOrder(@Payload() data: any) {
    console.log('AppController :>> ', 'getDummyOrder', data);
    return {
      id: new Date(Date.now()).getTime(),
      title: 'New order',
      reserved: true,
      from: 'ORDER_SERVICE',
    };
  }
}
