import { AxiosError, AxiosResponse } from "axios";
import { action, makeObservable, observable, runInAction } from "mobx";
import { ApiModule, ServerResponse } from "modules/api.module";
import { ServerUrlType, SocketResponseType } from "src/config/constants";

import { plainToInstance } from "class-transformer";
import authInstance from "modules/auth.module";
import { SocketModule } from "modules/socket.module";
import { NextRouter } from "next/router";
import { ChangeEvent, KeyboardEvent } from "react";
import sha256 from "sha256";
import AuthDto from "src/dto/auth/auth.dto";
import DataModel from "src/model/data.model";

interface IAuth {
  username: string;
  password: string;
}

export interface IDefaultProps {
  headers: any;
  host: string;
  router: NextRouter;
  userAgent: string;
}

export default class ViewModel {
  public account: IAuth = { username: "", password: "" };
  public unMount: boolean = false;
  public renderData: DataModel = new DataModel();
  public beforeData: DataModel = new DataModel();
  public dataList: DataModel[] = [];
  protected api: ApiModule;
  public auth: AuthDto = new AuthDto();
  public socket: SocketModule;
  public router: NextRouter;
  public machineReady: boolean = false;
  public isSettingStat: boolean = false;
  public target: number = 0;

  constructor(props: IDefaultProps) {
    this.api = ApiModule.getInstance();
    this.router = props.router;

    makeObservable(this, {
      popAuth: action,
      onOpen: action,
      processingBinaryData: action,
      processingObjectData: action,
      socketDisconnect: action,
      handleChangePassword: action,
      handleChangeUsername: action,
      initializeSocket: action,

      target: observable,
      account: observable,
      renderData: observable,
      dataList: observable,
      auth: observable,
      socket: observable,
      machineReady: observable,
    });
  }

  insertInstalledTransmitters = async () => {
    await this.api
      .post(ServerUrlType.APIS, "/api/cloud/installedTransmitters")
      .then((result: AxiosResponse<ServerResponse<any>>) => {
        const data = result.data.data;

        setTimeout(() => {
          data.forEach((item) => {
            this.insertMachineStat(item.id);
          });
        }, 100);
      });
  };

  public insertMachineStat = async (id: string) => {
    await this.api.post(ServerUrlType.EDGE, "/api/edge/edge_machine_stat", {
      transmitter: id,
    });
  };

  public insertMachineList = async (target: string) => {
    await this.api
      .get(ServerUrlType.BARO, "/machine/currentList")
      .then((result: AxiosResponse<any[]>) => {
        const data = result.data.find((machine) => machine.mid === target);

        runInAction(() => {
          this.target = data.mkey;
        });
        this.initializeSocket();
      })
      .catch((error: AxiosError) => {
        console.log("error : ", error);
        return false;
      });
  };

  // ********************소켓******************** //
  // ********************소켓******************** //
  // ********************소켓******************** //
  // ********************소켓******************** //
  // ********************소켓******************** //

  onOpen = () => {
    console.log("WebSocket connected!!");

    //소켓 연결완료 후 사용자가 소켓서버 이용을 시작함을 서버에 알리는 이벤트
    this.socket.sendEvent({ token: this.auth.token });
    this.insertInstalledTransmitters();
    runInAction(() => {
      this.unMount = false;
    });
  };
  // websocket_url+this.$store.state.sender+'?ent='+this.$store.state.enterprise+'&view=midext:'+this.mkey
  onMessage = async (response: MessageEvent) => {
    if (typeof response.data === "object") {
      this.processingBinaryData(response);
    } else {
      this.processingObjectData(response);
    }
  };

  processingBinaryData = async (response: MessageEvent) => {
    if (!this.isSettingStat) return;
    //바이너리 메시지
    const updateData = await response.data.text();
    const dataArray = updateData.split("|");

    let data = await this.setBinarySingleData(dataArray);

    runInAction(() => {
      this.beforeData = this.renderData;
      this.renderData = data;

      if (data.block !== "") {
        this.machineReady = true;
      }
    });

    if (data.isCutting) {
      let dataList = [...this.dataList];

      const isCutInnerCondition = (loopTarget) =>
        data.isCutInner &&
        Math.abs(loopTarget.z - data.z) < 0.2 &&
        loopTarget.x < data.x;

      const isNotCutInnerCondition = (loopTarget) =>
        !data.isCutInner &&
        loopTarget.x > data.x &&
        Math.abs(loopTarget.z - data.z) < 0.2 &&
        Math.abs(this.beforeData.z - data.z) > 0.1;

      for (let i = 0; i < dataList.length; i++) {
        const loopTarget = dataList[i];
        if (isCutInnerCondition(loopTarget)) {
          dataList.splice(i, 1);
          i--;
        } else if (isNotCutInnerCondition(loopTarget)) {
          dataList[i] = plainToInstance(DataModel, {
            ...data,
            z: loopTarget.z,
            block: loopTarget.block,
          });
        }
      }
      const isOutOfSync =
        this.beforeData.isCutting === true &&
        this.renderData.isCutting === false;

      if (isOutOfSync) {
        console.log("cut finish", data.block);
      }

      const isDataListLengthValid =
        dataList.length <= 1 ||
        (Math.abs(this.beforeData.x - data.x) < 0.7 &&
          Math.abs(this.beforeData.z - data.z) < 0.7);

      if (isDataListLengthValid) {
        dataList.push(data);
      } else {
        console.log("So fast!!");
      }

      console.log(data);

      runInAction(() => {
        this.dataList = dataList;
      });
    }
  };

  setBinarySingleData = async (dataArray: string[]) => {
    const pathIndex = dataArray.indexOf("path_position");
    const blockIndex = dataArray.indexOf("block");
    const xLoadIndex = dataArray.indexOf("Xload");
    const zLoadIndex = dataArray.indexOf("Zload");

    let data: DataModel = { ...this.renderData };

    const lastData = this.dataList[this.dataList.length - 1];

    if (pathIndex !== -1) {
      const path = dataArray[pathIndex + 1].split(" ");
      data = {
        ...data,
        x: Math.floor(+path[0] * 10) / 100,
        z: Math.floor(+path[2] * 10) / 100,
      };

      if (Math.floor(+path[0] * 10) / 100 < 10) {
        data.isCutInner = true;
      } else {
        data.isCutInner = false;
      }
    } else {
      data = {
        ...data,
        x: +lastData?.x,
        z: +lastData?.z,
      };
    }

    if (blockIndex !== -1) {
      const blockCode = dataArray[blockIndex + 1];
      data = this.cutExtract(data, blockCode);
    } else {
      data = {
        ...data,
        block: lastData?.block,
      };
    }

    if (xLoadIndex !== -1) {
      data = { ...data, xLoad: +dataArray[xLoadIndex + 1] };
    } else {
      data = {
        ...data,
        xLoad: +lastData?.xLoad,
      };
    }

    if (zLoadIndex !== -1) {
      data = { ...data, zLoad: +dataArray[zLoadIndex + 1] };
    } else {
      data = {
        ...data,
        zLoad: +lastData?.zLoad,
      };
    }

    return data;
  };

  cutExtract = (data: DataModel, block: string): DataModel => {
    const cuttingRegex = /^G(?:0[1-3]|[1-3])(?![0-9])[\s\S]*$/;
    const functionRegex = /^N\d{3}.*/;
    const moveRegex = /^[XZUW]/;
    const programRegex = /^O\d{4}/;
    const isCuttingCode = cuttingRegex.test(block) || functionRegex.test(block);

    // if (programRegex.test(block)) location.reload();

    if (isCuttingCode) {
      data.isCutting = true;
    } else {
      const isMoveCode = moveRegex.test(block);

      if (this.dataList[this.dataList.length - 1].isCutting && isMoveCode) {
        data.isCutting = true;
      } else {
        data.isCutting = false;
      }
    }

    data = { ...data, block: block };
    return data;
  };

  processingObjectData = (response: MessageEvent) => {
    const objectMessage = JSON.parse(response.data);

    if (objectMessage.response === SocketResponseType.MACHINE) {
      const machine = objectMessage.data.find(
        (item: any) => +item.Id === this.target
      ).Data;

      const path = machine.path_position.split(" ");

      const newRenderData = {
        x: Math.floor(path[0] * 10) / 100,
        z: Math.floor(path[2] * 10) / 100,
        xLoad: +machine.Xload,
        zLoad: +machine.Zload,
        block: "render start",
        isCutting: false,
        isCutInner: false,
      };

      runInAction(() => {
        this.renderData = newRenderData;
        this.dataList = [newRenderData];
        this.isSettingStat = true;
      });
    }
  };

  socketDisconnect = () => {
    runInAction(() => {
      this.unMount = true;
      if (this.socket?.socket?.readyState === WebSocket.OPEN) {
        this.socket.disconnect();
      }
    });
  };

  public onClose = () => {
    console.log("WebSocket closed");
    this.initializeSocket();
  };

  initializeSocket = () => {
    this.popAuth();
    this.socket = new SocketModule(this.auth.enterprise, this.target);
    this.socket.connect(this.onMessage, this.onOpen, this.onClose);
  };

  // ********************로그인******************** //
  // ********************로그인******************** //
  // ********************로그인******************** //
  // ********************로그인******************** //
  // ********************로그인******************** //

  handlePressLogin = ({ key }: KeyboardEvent<HTMLInputElement>) => {
    if (key === "Enter") {
      this.loginAction();
    }
  };

  loginAction = async () => {
    await this.api
      .post(ServerUrlType.BARO, "/login/login", {
        ...this.account,
        password: sha256(this.account.password),
      })
      .then((result: AxiosResponse<any>) => {
        if (result.data.success) {
          const auth = plainToInstance(AuthDto, {
            ...result.data,
            account: this.account.username,
            sender: window.localStorage.sender,
          });
          authInstance.saveStorage(auth);
          this.router.replace("/");
        } else {
          throw result.data;
        }
      });
  };

  handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    runInAction(() => {
      this.account = { ...this.account, username: value };
    });
  };

  handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    runInAction(() => {
      this.account = { ...this.account, password: value };
    });
  };

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
}
