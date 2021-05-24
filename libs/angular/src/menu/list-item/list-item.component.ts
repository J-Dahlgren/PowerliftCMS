import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Optional,
  Inject,
} from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { NavItem } from "./nav-item";
import { NavigationService } from "../navigation.service";
import { SubSink } from "subsink";
import { Router } from "@angular/router";
import { MENU_IS_TRANSLATED } from "../token";
@Component({
  selector: "dt-list-item",
  templateUrl: "./list-item.component.html",
  styleUrls: ["./list-item.component.scss"],
  animations: [
    trigger("indicatorRotate", [
      state("collapsed", style({ transform: "rotate(0deg)" })),
      state("expanded", style({ transform: "rotate(180deg)" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4,0.0,0.2,1)")
      ),
    ]),
  ],
})
export class ListItemComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  expanded = false;
  @Input() item!: NavItem;
  @Input() depth: number = 0;
  constructor(
    private navService: NavigationService,
    public router: Router,
    @Optional() @Inject(MENU_IS_TRANSLATED) public translated?: boolean
  ) {}

  ngOnInit() {
    this.subs.sink = this.navService
      .select("currentUrl")
      .subscribe((url: string) => {
        if (this.item.route && url) {
          this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        }
      });
  }
  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
      this.navService.collapse();
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
