import {
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
} from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";
import {
  ROOM,
  RoomEventBus,
  IEvent,
  NSP_PARTIAL_STATE_EVENT,
  RoomBus,
  ILogService,
  RoomEvent,
} from "@pc/util";
import { OnModuleDestroy } from "@nestjs/common";
import { SubSink } from "subsink";

export abstract class RoomEventGateway<T extends {}>
  extends RoomEventBus<T>
  implements OnGatewayInit, OnModuleDestroy {
  protected abstract logger: ILogService;
  constructor() {
    super();
  }
  protected subs = new SubSink();

  @WebSocketServer()
  nsp!: Namespace;
  afterInit(nsp: Namespace) {
    this.any().subscribe(this.emitInRoom);
  }

  @SubscribeMessage(ROOM.JOIN)
  joinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.leaveAll();
    client.join(room);
    this.logger.debug(`Client ${client.id} joined ${room}`);
  }
  @SubscribeMessage(ROOM.LEAVE)
  leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.leave(room);
  }
  protected emitToClient(client: Socket, e: IEvent<RoomBus<T>>) {
    client.emit(NSP_PARTIAL_STATE_EVENT, e);
  }
  protected emitInRoom(e: RoomEvent<T>) {
    this.nsp.in(e.room).emit(NSP_PARTIAL_STATE_EVENT, e);
  }
  onModuleDestroy() {
    this.subs.unsubscribe();
  }
}
