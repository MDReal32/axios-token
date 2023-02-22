export type TokenResponse<AT extends string, RT extends string, ATEI extends string> = Record<AT | RT, string> &
  Record<ATEI, number>;
