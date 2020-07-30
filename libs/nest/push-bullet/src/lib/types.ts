export interface User {
  created: number;
  email: string;
  email_normalized: string;
  iden: string;
  image_url: string;
  max_upload_size: number;
  modified: number;
  name: string;
}

export interface Device {
  active: boolean;
  app_version: number;
  created: number;
  iden: string;
  manufacturer: string;
  model: string;
  modified: number;
  nickname: string;
  push_token: string;
}

export interface INote {
  type: "note";
  title: string;
  body: string;
}
export class Note implements INote {
  type: "note" = "note";
  body: string;
  constructor(public title: string, body?: string) {
    this.body = body || "";
  }
}

export interface ILink {
  type: "link";
  title: string;
  body: string;
  url: string;
}
export type Push = INote | ILink;
