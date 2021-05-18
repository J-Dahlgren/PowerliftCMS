import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { NavigationService } from "../navigation.service";
import { NavItem } from "../list-item/nav-item";
import { Observable, fromEvent } from "rxjs";
import { SubSink } from "subsink";
import { filter } from "rxjs/operators";

@Component({
  selector: "dt-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"]
})
export class SideNavComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  @Input() appName: string = "";
  @Input() navItems: NavItem[] = [];
  expanded$: Observable<boolean>;

  constructor(private navService: NavigationService) {
    this.expanded$ = navService.select("expanded");
    this.subs.sink = fromEvent<KeyboardEvent>(document, "keyup")
      .pipe(filter(event => event.key === "Escape"))
      .subscribe(() => this.closeNav());
    this.subs.sink = fromEvent<KeyboardEvent>(document, "keyup")
      .pipe(filter(event => event.key === "q" && event.ctrlKey))
      .subscribe(() => this.navService.toggle());
  }

  ngOnInit(): void {}
  closeNav() {
    this.navService.collapse();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
