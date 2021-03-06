export enum JudgeDecision {
  NOT_DECIDED,
  SUCCESS,
  FAILED_RED,
  FAILED_BLUE,
  FAILED_YELLOW,
}

export function majorityApprove(decisions: JudgeDecision[]) {
  let ApproveCount = 0;
  for (const decision of decisions) {
    if (decision === JudgeDecision.SUCCESS) {
      ApproveCount++;
    }
  }
  return ApproveCount >= Math.ceil(decisions.length / 2);
}
export function allHasDecided(decisions: JudgeDecision[]): boolean {
  return decisions.length
    ? !decisions.some((decision) => decision === JudgeDecision.NOT_DECIDED)
    : false;
}
export function majorityHasDecided(decisions: JudgeDecision[]): boolean {
  let decideCount = 0;
  for (const decision of decisions) {
    if (decision !== JudgeDecision.NOT_DECIDED) {
      decideCount++;
    }
  }
  const majority = Math.ceil(decisions.length / 2);
  return decideCount >= majority;
}
