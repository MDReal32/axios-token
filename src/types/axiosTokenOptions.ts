import { AxiosError } from "axios";

export interface AxiosTokenOptions<AT extends string, RT extends string, ATEI extends string> {
  refreshTokenUrl?: string;
  storage?: Storage;
  storageKey?: string;
  accessTokenKey?: AT;
  refreshTokenKey?: RT;
  accessTokenExpiresInKey?: ATEI;
  onError?: (Error: AxiosError) => void;
  onExpired?: (Error: AxiosError) => void;
}
