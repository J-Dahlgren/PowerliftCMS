import { Component, OnInit, Input } from "@angular/core";
import { PlatformTimerService } from "../../core";

@Component({
  selector: "pc-platform-timer",
  templateUrl: "./platform-timer.component.html",
  styleUrls: ["./platform-timer.component.scss"],
})
export class PlatformTimerComponent implements OnInit {
  @Input() format: string = "mm:ss";

  constructor(public timer: PlatformTimerService) {}

  ngOnInit(): void {}
}
