import { Request } from 'express';
import { Controller, Get, Query, Redirect, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: Request): string {
    console.log(req);
    return this.appService.getHello();
  }

  @Get('redirect/docs')
  @Redirect('https://docs,nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version) {
      // 만약 브라우저에서 redirect/docs?version=5를 입력하면 v5로 이동시켜주는것이다.
      return { url: `https://docs.nestjs.com/v${version}/` };
    }
  }
}
