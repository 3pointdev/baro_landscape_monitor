import { AxiosResponse } from "axios";
import { plainToInstance } from "class-transformer";
import { action, makeObservable, observable, runInAction } from "mobx";
import { ApiModule } from "modules/api.module";
import authInstance from "modules/auth.module";
import { SocketModule } from "modules/socket.module";
import { NextRouter } from "next/router";
import { ServerUrlType } from "src/config/constants";
import AuthDto from "../dto/auth/auth.dto";

export interface IDefaultProps {
  headers: any;
  host: string;
  router: NextRouter;
  userAgent: string;
}

interface ILogin {
  username: string;
  password: string;
  sender: string;
}
export default class DefaultViewModel {
  protected api: ApiModule;
  public auth: AuthDto = new AuthDto();
  public socket: SocketModule;
  public router: NextRouter;
  constructor(props: IDefaultProps) {
    this.api = ApiModule.getInstance();
    this.router = props.router;

    makeObservable(this, {
      auth: observable,
      socket: observable,

      popAuth: action,
    });
  }

  popAuth = () => {
    runInAction(() => {
      const storage = {
        account: window.localStorage.account,
        enterprise: window.localStorage.enterprise,
        enterprise_id: window.localStorage.enterprise_id,
        token: window.localStorage.token,
        name: window.localStorage.name,
      };
      this.auth = plainToInstance(AuthDto, storage);
    });
  };

  insertLogin = async (params: ILogin, isRedirect: boolean): Promise<any> => {
    await this.api
      .post(ServerUrlType.BARO, "/login/login", params)
      .then((result: AxiosResponse<any>) => {
        if (result.data.success) {
          const auth = plainToInstance(AuthDto, {
            ...result.data,
            account: params.username,
            sender: params.sender,
          });
          runInAction(() => {
            this.auth = auth;
            if (isRedirect) {
              authInstance.saveStorage(auth);
              this.router.back();
            } else {
              authInstance.saveStorage(auth);
              this.router.replace("/");
            }
          });
          return true;
        } else {
          throw result.data;
        }
      });
  };

  insertLogout = () => {
    runInAction(() => {
      authInstance.destroyStorage();
      this.auth = new AuthDto();
    });
  };

  initializeSocket = (onMessage: (message) => void, onOpen: () => void) => {
    this.popAuth();
    this.socket = new SocketModule(this.auth.enterprise);
    this.socket.connect(onMessage, onOpen);
  };
}
