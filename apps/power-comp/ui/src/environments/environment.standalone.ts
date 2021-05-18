import { IEnvironment } from "./IEnvironment";
import { defaultEnvironment } from "./environment.default";
import { Environment } from "@pc/power-comp/shared";

export const environment: IEnvironment = {
  ...defaultEnvironment,
  type: Environment.STANDALONE
};
