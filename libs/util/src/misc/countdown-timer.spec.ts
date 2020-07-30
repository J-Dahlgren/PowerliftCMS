import { CountdownTimer } from "./countdown-timer";
import { sleep } from "./sleep";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
describe("CountdownTimer", () => {
  it("Starts clock on state change", async () => {
    const clock = new CountdownTimer(50);
    const done = new Subject();
    clock.pause(1000);
    clock.start();
    await sleep(150);
    expect(clock.status).toBe("ON");
    expect(clock.remainingMillis).toBeLessThanOrEqual(900);
    clock.pause(100);
    clock.start();
    await sleep(200);
    expect(clock.remainingMillis).toBe(0);
    expect(clock.status).toBe("OFF");
    clock.setClock({ state: "ON", remainingMillis: 100 });
    await sleep(50);
    expect(clock.status).toBe("ON");
    clock.pause();
    done.next();
  }, 1000);
});
