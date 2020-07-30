import { ProtectedStore } from "../state/protected-store";
import moment from "moment";
export enum TimerState {
  OFF,
  ON
}

export interface Clock {
  state: keyof typeof TimerState;
  remainingMillis?: number;
}
export class CountdownTimer extends ProtectedStore<Clock> {
  private interval = setTimeout(() => {}, 0); // Initialize with empty timer
  protected endTime: number = 0;
  constructor(protected tickInvervalMillis: number = 100) {
    super({ state: "OFF", remainingMillis: 0 });
    this.select("remainingMillis").subscribe(t => {
      if (!t || t < 0) {
        this._state.next({ state: "OFF", remainingMillis: 0 });
      }
    });
    this.select("state").subscribe(status => {
      if (status === "ON") {
        this.endTime = Date.now() + (this.get("remainingMillis") || 0);
        this.setInterval();
      } else {
        this.clearInterval();
      }
    });
  }

  public pause(remainingMillis?: number) {
    this.set("state", "OFF");
    if (typeof remainingMillis === "number" && remainingMillis >= 0) {
      this.set("remainingMillis", remainingMillis);
    }
    return this.remainingMillis;
  }
  public start() {
    this.set("state", "ON");
  }
  public setClock(c: Clock) {
    this.pause(c.remainingMillis);
    this.set("state", c.state);
  }
  protected setInterval() {
    this.clearInterval();
    this.interval = setInterval(() => this.tick(), this.tickInvervalMillis);
    this.tick(); // run function once at first to avoid delay
  }
  protected clearInterval() {
    try {
      clearInterval(this.interval);
    } catch (e) {}
  }

  protected tick() {
    if (this.status === "ON") {
      const t = this.remainingMillis;

      if (t <= 0) {
        this.set("state", "OFF");
      }
      this.set("remainingMillis", t);
    }
  }
  public get status() {
    return this.get("state");
  }

  public get remainingMillis(): number {
    if (this.status === "OFF") {
      return this.get("remainingMillis") || 0;
    }

    const delta = this.endTime - Date.now();
    return delta >= 0 ? delta : 0;
  }
  toString(format?: string) {
    return `${this.status}: ${moment(this.remainingMillis)
      .format(format || "m:ss.S")
      .toString()} s`;
  }
}
export class TimerOff implements Clock {
  readonly state = "OFF";
  constructor(public remainingMillis?: number) {}
}
export class TimerOn implements Clock {
  readonly state = "ON";
}
