import { Component, OnInit, OnDestroy } from "@angular/core";
import { HeaderService } from "@pc/angular/menu";

@Component({
  selector: "pc-display-shell",
  template: `
    <router-outlet> </router-outlet>
  `,
  styles: []
})
export class DisplayShellComponent implements OnInit, OnDestroy {
  constructor(private header: HeaderService) {}

  ngOnInit(): void {
    this.header.hide();
  }
  ngOnDestroy() {
    this.header.show();
  }
}
