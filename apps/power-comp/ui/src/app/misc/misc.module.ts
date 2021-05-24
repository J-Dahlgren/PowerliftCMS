import { NgModule } from "@angular/core";
import { MaterialModule } from "@pc/angular/material";
import { PlatformSelectComponent } from "./platform-select/platform-select.component";
import { TranslateModule } from "@ngx-translate/core";
import { CoreModule } from "../core";

@NgModule({
  imports: [MaterialModule, TranslateModule, CoreModule],
  declarations: [PlatformSelectComponent],
  exports: [PlatformSelectComponent],
})
export class MiscModule {}
