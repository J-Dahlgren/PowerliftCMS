import { NgModule } from "@angular/core";
import { HoverClassDirective, FocusElementDirective } from "./directives";
import { MomentPipe, KeysPipe } from "./pipes";

@NgModule({
  declarations: [
    HoverClassDirective,
    FocusElementDirective,
    MomentPipe,
    KeysPipe
  ],
  exports: [HoverClassDirective, FocusElementDirective, MomentPipe, KeysPipe]
})
export class UtilModule {}
