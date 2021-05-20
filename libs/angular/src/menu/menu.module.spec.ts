import { TestBed, waitForAsync } from "@angular/core/testing";
import { MenuModule } from "./menu.module";

describe("MenuModule", () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MenuModule],
      }).compileComponents();
    })
  );

  it("should create", () => {
    expect(MenuModule).toBeDefined();
  });
});
