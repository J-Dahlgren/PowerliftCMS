import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LanguageService } from "./language.service";
import { MaterialModule } from "../../material";
import { LanguageSelectorComponent } from "./language-selector/language-selector.component";
import { LanguageCode } from "./language-code";
import { COUNTRY_CODE_TOKEN } from "./token";
@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [LanguageSelectorComponent],
  exports: [LanguageSelectorComponent]
})
export class LanguageModule {
  static forRoot(codes: LanguageCode[]): ModuleWithProviders {
    return {
      ngModule: LanguageModule,
      providers: [
        {
          provide: COUNTRY_CODE_TOKEN,
          useValue: codes
        },
        LanguageService
      ]
    };
  }
}
