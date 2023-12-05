/**
 * 절삭면 타입
 */
export const CuttingEdgeType = {
  OUTSIDE: 0,
  INSIDE: 1,
  FRONT_SIDE: 2,
} as const;
export type CuttingEdgeType =
  (typeof CuttingEdgeType)[keyof typeof CuttingEdgeType];
