import { Pipe, PipeTransform } from "@angular/core";
import * as momentImported from "moment";
const moment = momentImported;

@Pipe({
  name: "moment",
})
export class MomentPipe implements PipeTransform {
  transform(value: Date | number | momentImported.Moment, ...args: any[]): any {
    const [format] = args;
    if (value === null || value === undefined) {
      return value;
    }

    try {
      const v = moment(value).format(format);
      return v;
    } catch (error) {
      return value;
    }
  }
}
