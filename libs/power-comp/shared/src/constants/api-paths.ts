import { IClientPlatformEvents } from "../events";

export interface Route {
  root: string;
}
export interface ApiRoutes {
  root: string;
  [key: string]: string;
}

export type ObjectPath<T extends {}> = {
  [key in keyof T]: string;
};
export type ObjectRoute<T extends {}> = Route & ObjectPath<T>;

const events: ObjectRoute<IClientPlatformEvents> = {
  root: "platform-event",
  decision: "decision",
  activeGroupId: "active-group",
  liftTimer: "lift-timer",
  secretariatDecision: "secretariat-decision"
};

export const api = {
  auth: {
    root: "auth",
    login: "login"
  },
  competition: "competition",
  platform: "platform",
  group: "group",
  lifter: {
    root: "lifter",
    drawLot: "draw-lot"
  },

  download: {
    root: "download",
    protocol: "protocol",
    registration: "registration"
  },
  upload: {
    root: "upload",
    registration: "registration"
  },
  weightCategory: "weight-category",
  events,
  competitionInfo: {
    root: "competition-info",
    result: "result",
    liftOrder: "lift-order"
  }
};
