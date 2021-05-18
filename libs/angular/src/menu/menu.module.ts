import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../material";
import { TranslateModule } from "@ngx-translate/core";
import { SideNavComponent } from "./side-nav/side-nav.component";
import { ListItemComponent } from "./list-item";
import { HeaderComponent } from "./header/header.component";
import { NavigationService } from "./navigation.service";
import { HeaderService } from "./header.service";
import { MENU_IS_TRANSLATED } from "./token";
@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule,
    RouterModule,
    TranslateModule
  ],
  declarations: [SideNavComponent, ListItemComponent, HeaderComponent],
  providers: [NavigationService, HeaderService],
  exports: [SideNavComponent, ListItemComponent, HeaderComponent]
})
export class MenuModule {
  static forRoot(translate?: boolean): ModuleWithProviders<MenuModule> {
    return {
      ngModule: MenuModule,
      providers: [{ provide: MENU_IS_TRANSLATED, useValue: translate || false }]
    };
  }
}
