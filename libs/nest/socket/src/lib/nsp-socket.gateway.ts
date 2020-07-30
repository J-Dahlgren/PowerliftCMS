import {
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  ConnectedSocket
} from "@nestjs/websockets";
import { Socket, Namespace } from "socket.io";
import { IStateStore, NSP_STATE_EVENT, ILogService } from "@dt/util";
import { OnModuleDestroy } from "@nestjs/common";
import { SubSink } from "subsink";
import { auditTime } from "rxjs/operators";

export abstract class NspSocketGateway<T extends {}>
  implements OnGatewayInit, OnModuleDestroy, OnGatewayConnection {
  protected subs = new SubSink();
  protected abstract store: IStateStore<T>;
  constructor(protected logger: ILogService, protected audit?: number) {}

  @WebSocketServer()
  nsp!: Namespace;
  afterInit(nsp: Namespace) {
    this.logger.trace("afterInit");
    this.subs.sink = this.store.$.pipe(
      auditTime(this.audit || 0)
    ).subscribe(state => this.nsp.emit(NSP_STATE_EVENT, state));
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    client.emit(NSP_STATE_EVENT, this.store.state);
    this.logger.trace(`Client ${client.id} connected`);
  }
  onModuleDestroy() {
    this.logger.warn("onModuleDestroy");
    this.subs.unsubscribe();
  }
}
