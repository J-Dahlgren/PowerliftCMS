import { Component, OnInit, Input, Inject, Optional } from "@angular/core";
import { NavigationService } from "../navigation.service";
import { Observable } from "rxjs";
import { HeaderService } from "../header.service";
import { MENU_IS_TRANSLATED } from "../token";

@Component({
  selector: "dt-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  visible$: Observable<boolean>;
  @Input() appName: string = "";
  constructor(
    headerService: HeaderService,
    private navService: NavigationService,
    @Optional() @Inject(MENU_IS_TRANSLATED) public translated?: boolean
  ) {
    this.visible$ = headerService.select("visible");
  }

  ngOnInit(): void {}
  toggleExpanded() {
    this.navService.toggle();
  }
}
