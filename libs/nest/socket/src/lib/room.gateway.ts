import {
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody
} from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";
import {
  ROOM,
  RoomEventBus,
  IEvent,
  NSP_PARTIAL_STATE_EVENT,
  RoomBus,
  extractKeys,
  ILogService,
  IRoomEvent,
  ProtectedRoomEventBus,
  RoomEvent
} from "@dt/util";
import { OnModuleDestroy } from "@nestjs/common";
import { SubSink } from "subsink";
import { take, takeUntil } from "rxjs/operators";
import { timer } from "rxjs";

export abstract class RoomGateway<T extends {}> extends RoomEventBus<T>
  implements OnGatewayInit, OnModuleDestroy {
  protected abstract logger: ILogService;
  constructor() {
    super();
  }
  protected subs = new SubSink();

  @WebSocketServer()
  nsp!: Namespace;
  afterInit(nsp: Namespace) {
    this.logger.trace("afterInit");
    this.subs.sink = this.any().subscribe(e => {
      nsp.in(e.room).emit(NSP_PARTIAL_STATE_EVENT, e);
    });
  }

  @SubscribeMessage(ROOM.JOIN)
  joinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.leaveAll();
    client.join(room);
    this.logger.trace(`Client ${client.id} joined ${room}`);
    this.requestRoom(room)
      .pipe(takeUntil(timer(1000)))
      .subscribe(
        data =>
          extractKeys(data).forEach(key =>
            this.emitToClient(client, {
              room,
              type: key,
              payload: data[key] as T[keyof T]
            })
          ),
        error =>
          this.logger.warn(
            `Request by ${client.id} for room ${room} failed: ${error}`
          )
      );
  }
  @SubscribeMessage(ROOM.LEAVE)
  leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    this.logger.trace(`Client ${client.id} left ${room}`);
    client.leave(room);
  }
  protected emitToClient(client: Socket, e: RoomEvent<T>) {
    client.emit(NSP_PARTIAL_STATE_EVENT, e);
  }
  protected emitInRoom(e: IEvent<RoomBus<T>>) {
    this.nsp.in(e.payload.room).emit(NSP_PARTIAL_STATE_EVENT, e);
  }
  onModuleDestroy() {
    this.subs.unsubscribe();
  }
}
