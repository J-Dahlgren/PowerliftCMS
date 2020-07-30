import { NavItem } from "@dt/angular/menu";

export const navItems: NavItem[] = [
  {
    displayName: "admin",
    iconName: "cog",
    route: "/competition"
  },
  {
    displayName: "display",
    iconName: "monitor",
    children: [
      {
        displayName: "display.main-result",
        iconName: "",
        route: "display/result-board"
      },
      {
        displayName: "display.lift-order",
        iconName: "",
        route: "display/lift-order"
      },
      {
        displayName: "display.attempt-board",
        iconName: "",
        route: "display/attempt-board"
      }
    ]
  },
  // {
  //   displayName: "Result",
  //   iconName: "podium",
  //   route: "/result"
  // },
  {
    displayName: "secretariat",
    iconName: "tablet-dashboard",
    route: "/secretariat"
  }
  // {
  //   displayName: "timekeeper",
  //   iconName: "timer",
  //   route: "/timekeeper"
  // }
];
