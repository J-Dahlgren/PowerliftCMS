import { async, TestBed } from "@angular/core/testing";
import { UiLoggerModule } from "./ui-logger.module";

describe("UiLoggerModule", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiLoggerModule]
    }).compileComponents();
  }));

  it("should create", () => {
    expect(UiLoggerModule).toBeDefined();
  });
});
