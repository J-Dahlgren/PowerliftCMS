import { SubSink } from "subsink";
import { Server, Socket } from "socket.io";
import {
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection
} from "@nestjs/websockets";
import { OnModuleDestroy, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { extractKeys, IEvent, ILogService } from "@dt/util";
export abstract class GlobalSocketGateway<T extends object>
  implements OnModuleDestroy, OnGatewayConnection {
  protected abstract logger: ILogService;
  subs = new SubSink();
  @WebSocketServer() server!: Server;
  constructor() {}
  abstract handleConnection(client: Socket): any;
  emit(event: IEvent<T>) {
    this.server.emit("data", event);
  }
  onModuleDestroy() {
    this.subs.unsubscribe();
  }
}
