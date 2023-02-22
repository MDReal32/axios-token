import type { AxiosInstance, AxiosResponse } from "axios";
import { AxiosError } from "axios";

import type { AxiosTokenOptions } from "./types/axiosTokenOptions";
import type { TokenResponse } from "./types/tokenResponse";

class AxiosToken<AT extends string, RT extends string, ATEI extends string> {
  private token: TokenResponse<AT, RT, ATEI> | null = null;
  private tokenKey = "axios-token";

  constructor(private axios: AxiosInstance, private options: AxiosTokenOptions<AT, RT, ATEI>) {
    if (typeof window !== "undefined") {
      this.options.storage ||= sessionStorage;
      this.options.storageKey ||= this.tokenKey;
    }
    this.handle();
  }

  getToken(): TokenResponse<AT, RT, ATEI> | null {
    if (typeof window !== "undefined") {
      return this.options.storage?.getItem(this.options.storageKey) as TokenResponse<AT, RT, ATEI>;
    }
    return this.token;
  }

  setToken(token: TokenResponse<AT, RT, ATEI>) {
    token[this.options.accessTokenExpiresInKey] < Date.now() - 3600 &&
      // @ts-ignore
      (token[this.options.accessTokenExpiresInKey] = Date.now() + token[this.options.accessTokenExpiresInKey] * 1000);
    if (typeof window !== "undefined") {
      this.options.storage?.setItem(this.options.storageKey, JSON.stringify(token));
    }
    this.token = token;
  }

  private handle() {
    this.axios.interceptors.request.use(async (config) => {
      const token = this.getToken();
      this.options.accessTokenKey ||= "accessToken" as AT;
      this.options.accessTokenExpiresInKey ||= "accessTokenExpiresIn" as ATEI;

      if (!token || config.url === this.options.refreshTokenUrl) {
        return config;
      }

      if (token[this.options.accessTokenKey] && Date.now() < token[this.options.accessTokenExpiresInKey]) {
        config.headers.Authorization = `Bearer ${token[this.options.accessTokenKey]}`;
      } else {
        try {
          const newToken = await this.updateToken();
          this.setToken(newToken);
          Object.assign(token, newToken);
          config.headers.Authorization = `Bearer ${token[this.options.accessTokenKey]}`;
        } catch (error) {
          this.options.onError(error);
        }
      }

      return config;
    });

    this.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          await this.updateToken(error);
        }
        return Promise.reject(error);
      }
    );
  }

  private async updateToken(): Promise<TokenResponse<AT, RT, ATEI>>;
  private async updateToken(error: AxiosError): Promise<AxiosResponse>;
  private async updateToken(error?: AxiosError) {
    const token = this.getToken();
    try {
      const { data: newToken } = await this.axios.post<TokenResponse<AT, RT, ATEI>>(this.options.refreshTokenUrl, {
        [this.options.refreshTokenKey]: token[this.options.refreshTokenKey],
      });
      this.setToken(newToken);
      Object.assign(token, newToken);
      if (error) {
        const config = error.config;
        config.headers.Authorization = `Bearer ${token[this.options.accessTokenKey]}`;
        return this.axios.request(config);
      } else {
        return newToken;
      }
    } catch (error) {
      this.options.onExpired(error);
    }
  }
}

export const axiosToken = <AT extends string, RT extends string, ATEI extends string>(
  axios: AxiosInstance,
  options: AxiosTokenOptions<AT, RT, ATEI>
) => new AxiosToken(axios, options);
