import { Gender, CompetitionModesEnum } from "../data-types";

type ConstantTuple = [number, number, number];
type IpfConstantMapper = {
  [genderKey in Gender]: {
    [modeKey in keyof typeof CompetitionModesEnum]: {
      /** RAW */
      raw: ConstantTuple;
      /** Equipped */
      equipped: ConstantTuple;
    };
  };
};
export const IPF_CONSTANTS: IpfConstantMapper = {
  m: {
    SBD: {
      raw: [1199.72839, 1025.18162, 0.00921],
      equipped: [1236.25115, 1449.21864, 0.01644]
    },
    B: {
      raw: [320.98041, 281.40258, 0.01008],
      equipped: [381.22073, 733.79378, 0.02398]
    }
  },
  f: {
    SBD: {
      raw: [610.32796, 1045.59282, 0.03048],
      equipped: [758.63878, 949.31382, 0.02435]
    },
    B: {
      raw: [142.40398, 442.52671, 0.04724],
      equipped: [221.82209, 357.00377, 0.02937]
    }
  }
};
