import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "pc-app-settings",
  templateUrl: "./app-settings.component.html",
  styleUrls: ["./app-settings.component.scss"]
})
export class AppSettingsComponent implements OnInit {
  visible = new BehaviorSubject(false);
  constructor() {}
  ngOnInit(): void {}
  toggle() {
    this.visible.next(!this.visible.value);
  }
}
