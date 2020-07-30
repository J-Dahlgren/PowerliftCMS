import { Inject, Injectable, HttpService } from "@nestjs/common";
import { PUSHBULLET_TOKEN } from "./token";
import { User, Device, Push } from "./types";

@Injectable()
export class PushbulletService {
  protected readonly URI = "https://api.pushbullet.com/v2";
  constructor(protected http: HttpService) {}
  protected buildPath(path: string) {
    return `${this.URI}/${path}`;
  }

  getUser() {
    return this.http.get<User>(this.buildPath("users/me"));
  }
  getDevices() {
    return this.http.get<{ devices: Device[] }>(this.buildPath("devices"));
  }
  createPush(push: Push) {
    return this.http.post(this.buildPath("pushes"), push);
  }
}
