import { Component, OnInit, OnDestroy } from "@angular/core";
import { LogService } from "../log-factory.service";
import { StateStore } from "@dt/util";
import { AutoUnsubscribeComponent } from "@dt/angular/util";
import { SubSink } from "subsink";

@Component({
  selector: "dt-log",
  templateUrl: "./log.component.html",
  styleUrls: ["./log.component.scss"]
})
export class LogComponent extends AutoUnsubscribeComponent implements OnInit {
  private filters = new StateStore<{}>({});
  constructor(private logService: LogService) {
    super();
  }

  ngOnInit(): void {}
}
