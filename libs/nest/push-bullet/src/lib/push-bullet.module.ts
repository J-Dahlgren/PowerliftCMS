import { Module, HttpModule, DynamicModule, Global } from "@nestjs/common";
import { PushbulletService } from "./push-bullet.service";
import { PUSHBULLET_TOKEN } from "./token";
@Global()
@Module({})
export class PushbulletModule {
  static forRoot(accessToken: string): DynamicModule {
    return {
      module: PushbulletModule,
      imports: [
        HttpModule.register({
          headers: {
            "Access-Token": accessToken
          }
        })
      ],
      providers: [
        {
          provide: PUSHBULLET_TOKEN,
          useValue: accessToken
        },
        PushbulletService
      ],
      exports: [PUSHBULLET_TOKEN, PushbulletService]
    };
  }
}
