import { TestBed, waitForAsync } from "@angular/core/testing";
import { MaterialModule } from "./material.module";

describe("MaterialModule", () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MaterialModule],
      }).compileComponents();
    })
  );

  it("should create", () => {
    expect(MaterialModule).toBeDefined();
  });
});
