import { PipeTransform, Pipe } from "@angular/core";
import { ExtractEnumKeys, EnumKeys } from "@dt/util";
@Pipe({ name: "keys" })
export class KeysPipe implements PipeTransform {
  transform<T extends object>(val: T) {
    return ExtractEnumKeys(val).map(key => ({
      key,
      value: val[key]
    }));
  }
}
