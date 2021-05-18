import { UiLogger } from "../logger";
import { tap } from "rxjs/operators";
import { assert } from "chai";

export interface BaseApiOpts {
  base: string;
  path: string;
}
export class BaseApiService {
  constructor(protected opts: BaseApiOpts, protected logger: UiLogger) {
    logger.log(`Path: ${opts.base}/${opts.path}`);
  }
  protected get path() {
    return `${this.opts.base}/${this.opts.path}`;
  }
  public buildPath(...paths: string[]) {
    assert.isAbove(paths.length, 0);
    return `${this.path}/${paths.join("/")}`;
  }
  protected query(queryStr: string) {
    return queryStr ? `?${queryStr}` : "";
  }
  protected errorTap<K>() {
    return tap<K>(
      () => {},
      err => this.logger.error(err?.message ?? "An error occurred")
    );
  }
}
