import { Injectable, Inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageCode } from "./language-code";
import { StateStore } from "@pc/util";
import { LocalStorageService } from "ngx-webstorage";
import { COUNTRY_CODE_TOKEN } from "./token";
const enLanguage: LanguageCode = { language: "en", flag: "gb" };
@Injectable({ providedIn: "root" })
export class LanguageService {
  public readonly store = new StateStore<{
    languages: LanguageCode[];
    selected: LanguageCode;
  }>({ languages: [], selected: enLanguage });
  constructor(
    @Inject(COUNTRY_CODE_TOKEN) codes: LanguageCode[],
    private lsService: LocalStorageService,
    private translateService: TranslateService
  ) {
    this.store.set("languages", codes);
    const initialLang = translateService.getBrowserLang();
    translateService.setDefaultLang("en");

    const lang: LanguageCode | undefined = lsService.retrieve("LANGUAGE");
    if (!lang && codes.findIndex((l) => l.language === initialLang) >= 0) {
      this.setLanguage(
        codes[codes.findIndex((l) => l.language === initialLang)]
      );
    } else if (
      lang &&
      codes.findIndex((l) => l.language === lang.language) < 0
    ) {
      this.setLanguage(enLanguage);
    } else {
      this.setLanguage(
        codes[codes.findIndex((l) => l.language === lang?.language)]
      );
    }
  }
  public get selected() {
    return this.store.state.selected;
  }

  public setLanguage(lang: LanguageCode | string) {
    const available = this.store.get("languages");
    const requested = typeof lang === "string" ? lang : lang.language;
    const selected = available.find((l) => l.language === requested);
    if (selected) {
      this.store.set("selected", selected);
      this.lsService.store("LANGUAGE", selected);
      this.translateService.use(selected.language);
    }
  }
}
