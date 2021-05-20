import { TestBed, waitForAsync } from "@angular/core/testing";
import { UiLoggerModule } from "./ui-logger.module";

describe("UiLoggerModule", () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [UiLoggerModule],
      }).compileComponents();
    })
  );

  it("should create", () => {
    expect(UiLoggerModule).toBeDefined();
  });
});
