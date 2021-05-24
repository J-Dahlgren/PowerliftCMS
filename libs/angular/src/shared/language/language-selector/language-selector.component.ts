import { Component, OnInit, Input } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { LanguageCode } from "../language-code";
import { LanguageService } from "../language.service";
import { Observable } from "rxjs";

@Component({
  selector: "dt-language-selector",
  templateUrl: "./language-selector.component.html",
  styleUrls: ["./language-selector.component.scss"],
})
export class LanguageSelectorComponent implements OnInit {
  selected$: Observable<LanguageCode>;
  langs$: Observable<LanguageCode[]>;
  constructor(public languageService: LanguageService) {
    this.selected$ = languageService.store.select("selected");
    this.langs$ = languageService.store.select("languages");
  }

  ngOnInit(): void {}
}
