import { AxiosError } from "axios";

export interface AxiosTokenOptions<AT extends string, RT extends string, ATEI extends string> {
  refreshTokenUrl?: string;
  storage?: typeof localStorage | typeof sessionStorage;
  storageKey?: string;
  accessTokenKey?: AT;
  refreshTokenKey?: RT;
  accessTokenExpiresInKey?: ATEI;
  onError?: (Error: AxiosError) => void;
  onExpired?: (Error: AxiosError) => void;
}
