import { ProtectedStore, NSP_STATE_EVENT, extractKeys } from "@dt/util";
import { OnDestroy } from "@angular/core";
import { SubSink } from "subsink";
import { fromEvent, BehaviorSubject } from "rxjs";
import { connect } from "socket.io-client";
import { APP_INFO_NSP } from "@dt/power-comp/shared";
import { SocketState } from "./socket-state";
import { distinctUntilChanged } from "rxjs/operators";
export abstract class NspSocketService<T extends {}> extends ProtectedStore<T>
  implements OnDestroy {
  protected subs = new SubSink();
  protected connected = new BehaviorSubject(false);
  socket: SocketIOClient.Socket;
  constructor(nsp: string, initial: T) {
    super(initial);
    this.socket = connect(`/${nsp}`);
    this.subs.sink = fromEvent<T>(
      this.socket,
      NSP_STATE_EVENT
    ).subscribe(state => this._state.next(state));

    this.socket.on("connect", () => this.connected.next(true));
    this.socket.on("connect_error", () => this.connected.next(false));
  }
  get connected$() {
    return this.connected.pipe(distinctUntilChanged());
  }
  get latency$() {
    return fromEvent<number>(this.socket, "pong");
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
