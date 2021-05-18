import { UiLogger } from "@pc/angular/logger";
import { BehaviorSubject, fromEvent } from "rxjs";
import { connect } from "socket.io-client";
import { distinctUntilChanged, skip, map, filter } from "rxjs/operators";
import { ProtectedStore, IEvent } from "@pc/util";
import { SocketState } from "./socket-state";

export abstract class TypedSocketService<
  RxT extends object,
  S extends SocketState = SocketState
> extends ProtectedStore<S> {
  protected _socket: SocketIOClient.Socket;
  constructor(
    protected logger: UiLogger,
    host: string,
    port: number,
    initialValue: S
  ) {
    super(initialValue);
    const socketUrl = `${host}:${port}/`;
    this.logger.trace(`Url: ${socketUrl}`);
    const socket = connect(socketUrl, {
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000
    });
    this._socket = socket;
    socket.on("connect", () => this.set("connected", true));
    socket.on("connect_error", () => this.set("connected", false));
    this.select("connected")
      .pipe(skip(1))
      .subscribe(connected =>
        connected
          ? this.logger.log("Connected")
          : this.logger.warn("Disconnected")
      );
  }
  public get socket() {
    return this._socket;
  }
  public any$() {
    return fromEvent<IEvent<RxT>>(this.socket, "data");
  }

  public on<K extends keyof RxT>(event: K) {
    return this.any$().pipe(
      filter(e => e.type === event),
      map(e => e.payload as RxT[K])
    );
  }
}
