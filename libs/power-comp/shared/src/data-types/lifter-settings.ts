import { ExtractEnumKeys } from "@pc/util";
import { LiftField } from "./lifts";

export enum SquatRackSettingsEnum {
  NONE = 0,
  BOTH,
  LEFT,
  RIGHT
}
export const squatRackSettings = ExtractEnumKeys(SquatRackSettingsEnum);
export interface IBenchPressSettings {
  rackHeight?: number;
  safetyRackHeight?: number;
  liftOffAssistance?: boolean;
}
export interface ISquatSettings {
  rackTilt?: keyof typeof SquatRackSettingsEnum;
  rackHeight?: number;
}
type SettingsIndex = { [key in LiftField]?: any };

export interface ILifterSettings extends SettingsIndex {
  bench: IBenchPressSettings;
  squat: ISquatSettings;
}
