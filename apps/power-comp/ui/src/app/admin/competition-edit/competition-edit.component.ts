import { Component, OnInit } from "@angular/core";
import { UiLogger, LogService } from "@dt/angular/logger";
import { Observable, BehaviorSubject } from "rxjs";
import { IEntity } from "@dt/util";
import { ICompetition, IPlatform } from "@dt/power-comp/shared";
import { ActivatedRoute, Router } from "@angular/router";
import { CompetitionService } from "../../core";
import { ModalService } from "@dt/angular/shared";
import { switchMap } from "rxjs/operators";
import { PlatformDialogComponent } from "../dialog";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { CompetitionEditService } from "../competition-edit.service";
import { AutoUnsubscribeComponent } from "@dt/angular/util";
import { TranslateService } from "@ngx-translate/core";
interface Link {
  route: string;
  icon?: string;
}
@Component({
  selector: "pc-competition-edit",
  templateUrl: "./competition-edit.component.html",
  styleUrls: ["./competition-edit.component.scss"],
  providers: [CompetitionEditService]
})
export class CompetitionEditComponent extends AutoUnsubscribeComponent
  implements OnInit {
  logger: UiLogger;
  id: number;
  comp$: Observable<IEntity<ICompetition>>;
  activeLink$ = new BehaviorSubject("lifters");
  activeLink = "lifters";
  links = ["lifters", "groups", "platforms"];
  _links: Link[] = [
    {
      route: "lifters",
      icon: "weight-lifter"
    },
    {
      route: "groups",
      icon: "account-group"
    },
    {
      route: "platforms",
      icon: "vector-square"
    },
    {
      route: "weight-categories",
      icon: "weight-kilogram"
    },
    {
      route: "results",
      icon: "podium"
    }
  ];
  constructor(
    route: ActivatedRoute,
    router: Router,
    logService: LogService,
    editService: CompetitionEditService,
    competitionService: CompetitionService,
    private translate: TranslateService,
    private dialog: ModalService
  ) {
    super();
    this.id = +route.snapshot.params.id;
    competitionService.get(this.id).subscribe(
      () => {},
      e => router.navigate(["competition"])
    );
    editService.set("id", this.id);
    const query = RequestQueryBuilder.create({
      join: [
        {
          field: "platforms"
        },
        { field: "platform.groups" }
      ]
    }).query();
    this.logger = logService.create("CompetitionEditComponent");
    this.comp$ = route.params.pipe(
      switchMap(params => competitionService.getAllRelations(+params.id))
    );
  }
  editPlatform(platform: IEntity<IPlatform>) {
    this.dialog.openEditModal(PlatformDialogComponent, {
      data: { id: +platform.id },
      minWidth: "300px"
    });
  }
  ngOnInit(): void {}
}
