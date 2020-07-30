import { Gender } from "../data-types/IPerson";
import { ILifter, getResult } from "../data-types";
import { IPF_CONSTANTS } from "./ip-constants";

/**
  IPF Score formula

  https://www.powerlifting.sport/fileadmin/ipf/data/ipf-formula/IPF_GL_Coefficients-2020.pdf
*/
export function ipfScoreFormula<T extends ILifter>(lifter: T): number {
  const total = getResult(lifter).total;

  if (!lifter.bodyWeight || lifter.bodyWeight <= 0 || total <= 0) {
    return 0;
  }
  const constants =
    IPF_CONSTANTS[lifter.gender][lifter.competitionMode || "SBD"][
      lifter.equipped ? "equipped" : "raw"
    ];
  const A = constants[0];
  const B = constants[1];
  const C = constants[2];

  /*
    bwt - body weight
    total = 0: IPFPoints = 0
    total > 0: IPFpoints = 100 / (A - B * e^(-C*bwt))
  */

  let IPFpoints = total * (100 / (A - B * Math.exp(-C * lifter.bodyWeight)));

  IPFpoints = parseFloat(IPFpoints.toFixed(2));
  return IPFpoints;
}
