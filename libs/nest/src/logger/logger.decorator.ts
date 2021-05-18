import { Inject } from "@nestjs/common";

export const prefixesForLoggers: string[] = new Array<string>();

export function LogInject(prefix: string = "") {
  if (!prefixesForLoggers.includes(prefix)) {
    prefixesForLoggers.push(prefix);
  }
  return Inject(createProvider(prefix));
}
export function createProvider(prefix: string = "") {
  return `LoggerService${prefix}`;
}
