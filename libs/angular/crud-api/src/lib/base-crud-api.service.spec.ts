import { BaseCrudApiService } from "./base-crud-api.service";
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { LogService } from "@dt/angular/logger";
import { TestBed } from "@angular/core/testing";
import { LogLevel } from "@dt/util";
interface TestType {
  a?: number;
  b?: string;
}
@Injectable()
class MockApiService extends BaseCrudApiService<TestType> {
  protected minDelay: number = 0;
  constructor(protected http: HttpClient, logService: LogService) {
    super("test", logService.create("MockApiService"));
  }
}
describe("BaseApiService", () => {
  let service: MockApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogService, MockApiService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(MockApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("Gets one", done => {
    service.get(1).subscribe(data => {
      expect(data.id).toBe(1);
      expect(data.a).toBe(1);
      done();
    });
    const req = httpMock.expectOne("/api/test/1");
    expect(req.request.method).toBe("GET");
    req.flush({ id: 1, a: 1 });
    httpMock.verify();
  });

  it("Gets many", done => {
    service.getMany().subscribe(data => {
      expect(data.length).toBe(0);
      done();
    });
    const req = httpMock.expectOne("/api/test");
    expect(req.request.method).toBe("GET");
    req.flush([]);
    httpMock.verify();
  });

  it("Creates", done => {
    service.create({}).subscribe(data => {
      expect(data.id).toBe(2);
      expect(data.a).toBe(2);
      done();
    });
    const req = httpMock.expectOne("/api/test");
    expect(req.request.method).toBe("POST");
    req.flush({ id: 2, a: 2 });
    httpMock.verify();
  });

  it("Updates", done => {
    service.update({ id: 2, b: "2" }).subscribe(data => {
      expect(data.b).toBe("2");
      done();
    });
    const req = httpMock.expectOne("/api/test/2");
    expect(req.request.method).toBe("PUT");
    req.flush({ id: 2, b: "2" });
    httpMock.verify();
  });

  it("Deletes", done => {
    service.delete(2).subscribe(data => {
      done();
    });

    const req = httpMock.expectOne("/api/test/2");
    expect(req.request.method).toBe("DELETE");
    req.flush(null);
    httpMock.verify();
  });

  it("Emits log on error", done => {
    const logService = TestBed.inject(LogService);
    service.get(1).subscribe(
      data => done(1),
      err => {
        expect(err.message).toBe(
          "Http failure response for /api/test/1: 500 ERROR"
        );
        done();
      }
    );

    logService.log$.subscribe(event => {
      expect(event.logLevel).toBe(LogLevel.error);
    });
    const req = httpMock.expectOne("/api/test/1");
    expect(req.request.method).toBe("GET");
    req.flush(null, { status: 500, statusText: "ERROR" });
    httpMock.verify();
  });
});
