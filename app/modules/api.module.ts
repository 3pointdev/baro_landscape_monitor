import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseHeaders,
  RawAxiosRequestHeaders,
} from "axios";
import { ServerUrlType } from "src/config/constants";
import authInstance from "./auth.module";

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  config: any;
  request?: any;
}

export interface ServerResponse<T> {
  data: T;
}

export class ApiModule {
  private static instance: ApiModule;
  private axios: AxiosInstance = axios.create({});
  private token: string | null = "";
  private commonHeader: RawAxiosRequestHeaders;

  private constructor() {
    this.commonHeader = {
      "Content-Type": "application/json",
      "X-Access-Token": "",
    };
  }

  private setToken(): void {
    this.token = window.localStorage.getItem("token");
    this.commonHeader["X-Access-Token"] = this.token;
  }

  private setAxiosInstance(server: ServerUrlType) {
    this.setToken();
    this.axios = axios.create({
      baseURL: server,
      headers: this.commonHeader,
      responseType: "json",
    });
  }

  public static getInstance(): ApiModule {
    return this.instance || (this.instance = new this());
  }

  async get<T>(server: ServerUrlType, url: string, params?: T) {
    if (
      !authInstance.isLogin() &&
      url !== "/login/login" &&
      url !== "/login/findId"
    ) {
      throw "please login";
    }
    const sender = window.localStorage.sender;
    this.commonHeader["Content-Type"] = "application/json";
    this.setAxiosInstance(server);
    return await this.axios
      .get(url, {
        params: { ...params, sender: sender },
      })
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  async post<T>(
    server: ServerUrlType,
    url: string,
    params?: T,
    config?: AxiosRequestConfig
  ) {
    if (
      !authInstance.isLogin() &&
      url !== "/login/login" &&
      url !== "/login/findId"
    )
      throw "please login";
    const sender = window.localStorage.sender;

    this.setAxiosInstance(server);
    return await this.axios
      .post(url, { ...params, sender: sender }, config)
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  async put<T>(server: ServerUrlType, url: string, params?: T) {
    if (
      !authInstance.isLogin() &&
      url !== "/login/login" &&
      url !== "/login/findId"
    )
      throw "please login";
    const sender = window.localStorage.sender;

    this.commonHeader["Content-Type"] = "application/json";
    this.setAxiosInstance(server);
    return await this.axios
      .put(url, { params: { ...params, sender: sender } })
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  async patch<T>(server: ServerUrlType, url: string, params?: T) {
    if (
      !authInstance.isLogin() &&
      url !== "/login/login" &&
      url !== "/login/findId"
    )
      throw "please login";
    // const sender = window.localStorage.sender;

    this.commonHeader["Content-Type"] = "application/json";
    this.setAxiosInstance(server);
    return await this.axios
      .patch(url, params)
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  async delete(server: ServerUrlType, url: string) {
    if (
      !authInstance.isLogin() &&
      url !== "/login/login" &&
      url !== "/login/findId"
    )
      throw "please login";
    this.commonHeader["Content-Type"] = "application/json";
    this.setAxiosInstance(server);
    return await this.axios
      .delete(url)
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  // isFileParams(params: any): boolean {
  //   // params가 단순 변수일때 파일인지 구분해서 true 리턴
  //   if (params instanceof File) {
  //     return true;
  //   }

  //   // params가 배열일때
  //   if (Array.isArray(params)) {
  //     // 배열 내 file이 존재하면 true 리턴
  //     for (let i = 0; i < params.length; i++) {
  //       if (this.isFileParams(params[i])) {
  //         return true;
  //       }
  //       // 배열 내 배열 또는 객체 존재하는지 확인
  //       if (Array.isArray(params[i]) || typeof params[i] === "object") {
  //         const keys = Object.keys(params[i]);
  //         // 배열 내 배열 또는 객체 하나씩 재확인 file이라면 true 리턴
  //         for (let j = 0; j < keys.length; j++) {
  //           if (this.isFileParams(params[i][keys[j]])) {
  //             return true;
  //           }
  //         }
  //       }
  //     }
  //     // params가 객체일때
  //   } else if (typeof params === "object" && params !== null) {
  //     // 객체 내 file이 존재하면 true 리턴
  //     const keys = Object.keys(params);
  //     for (let i = 0; i < keys.length; i++) {
  //       if (this.isFileParams(params[keys[i]])) {
  //         return true;
  //       }
  //       // 객체 내 배열 또는 객체가 존재하는지 확인
  //       if (
  //         Array.isArray(params[keys[i]]) ||
  //         typeof params[keys[i]] === "object"
  //       ) {
  //         if (!params[keys[i]]) {
  //           continue;
  //         }
  //         const subKeys = Object.keys(params[keys[i]]);
  //         // 객체 내 배열 또는 객체 하나씩 재확인 file이라면 true 리턴
  //         for (let j = 0; j < subKeys.length; j++) {
  //           if (this.isFileParams(params[keys[i]][subKeys[j]])) {
  //             return true;
  //           }
  //         }
  //       }
  //     }
  //   }

  //   //모든 조건에 실패하면 false 리턴
  //   return false;
  // }

  private handleSuccess = <T>(response: AxiosResponse<T>): AxiosResponse<T> => {
    return response;
  };

  private handleError = (error: any): AxiosError => {
    const { data } = error.response;

    throw data;
  };
}
