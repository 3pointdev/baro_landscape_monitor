import { AxiosError, AxiosResponse } from "axios";
import { plainToInstance } from "class-transformer";
import { IAlertState } from "components/alert/alert";
import { action, makeObservable, observable, runInAction } from "mobx";
import { Alert } from "modules/alert.module";
import { ServerResponse } from "modules/api.module";
import mapperInstance from "modules/mapper.module";
import {
  BinaryMessageType,
  ServerUrlType,
  SocketBroadcastType,
  SocketResponseType,
} from "src/config/constants";
import MachineDto from "src/dto/machine/machine.dto";
import MonitorListDto from "src/dto/monitor/monitorList.dto";
import MountedDto from "src/dto/monitor/mounted.dto";
import MonitorNoticeDto from "src/dto/notice.dto";
import NotificationDto from "src/dto/notification.dto";
import NotificationModel from "src/model/notification.model";
import DefaultViewModel, { IDefaultProps } from "./default.viewModel";

export default class ViewModel extends DefaultViewModel {
  public machines: MachineDto[] = [];
  public notiList: NotificationDto[] = [];
  public notiModel: NotificationModel = new NotificationModel();
  public mountedList: MountedDto = new MountedDto();
  public monitorList: MonitorListDto[] = [];

  public notice: string = "";
  public unMount: boolean = false;

  public alertState: IAlertState = {
    isPositive: true,
    isActive: false,
    title: "string",
  };

  constructor(props: IDefaultProps) {
    super(props);

    makeObservable(this, {
      machines: observable,
      notiList: observable,
      notiModel: observable,
      mountedList: observable,
      monitorList: observable,
      notice: observable,
      alertState: observable,

      onMessage: action,
      getMachineList: action,
      getMounted: action,
    });
  }

  initialize = async (monitor) => {
    window.localStorage.setItem("monitor", monitor);

    await this.getMounted(monitor);

    await this.getMachineList();

    await this.getMonitorList();

    this.getNotice(this.monitorList, monitor);
  };

  selectMonitor = async () => {
    await this.getMonitorList();

    Alert.selector({
      title: "모니터를 선택해 주세요.",
      input: "select",
      className: "monitoring_item",
      options: this.monitorList.map((monitor: MonitorListDto) => {
        return `${monitor.name}`;
      }),
      callback: (value) => {
        const target = this.monitorList[value];
        window.localStorage.setItem("monitor", target.name);
        location.replace(`?monitor=${target.name}`);
      },
    });
  };

  getMonitorList = async () => {
    await this.api
      .get(ServerUrlType.BARO, "/mon")
      .then((result: AxiosResponse<MonitorListDto[]>) => {
        const data = result.data.map((item: MonitorListDto) =>
          plainToInstance(MonitorListDto, item)
        );

        runInAction(() => {
          this.monitorList = data;
        });
      })
      .catch((error: AxiosError) => {
        console.log("error : ", error);
        return false;
      });
  };

  getMounted = async (monitorName: string | string[]) => {
    await this.api
      .post(ServerUrlType.APIS, "/api/cloud/monitorList", {
        monitor: monitorName,
      })
      .then((result: AxiosResponse<ServerResponse<MountedDto>>) => {
        runInAction(() => {
          this.mountedList = plainToInstance(MountedDto, result.data.data);
        });
      })
      .catch((error: AxiosError) => {
        console.log("error : ", error);
        return false;
      });
  };

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

  getMachineList = async () => {
    await this.api
      .get(ServerUrlType.BARO, "/machine/currentList")
      .then((result: AxiosResponse<any[]>) => {
        const data = result.data;

        // 주어진 id 배열에 해당하는 객체들을 필터링하고 순서대로 정렬
        const newMachines = this.mountedList.machines
          .map((id) =>
            mapperInstance.currentListMapper(
              data.find((item) => +item.mkey === +id)
            )
          )
          .filter(Boolean); // undefined 제외

        runInAction(() => {
          this.machines = newMachines;
          this.initializeSocket(this.onMessage, this.onOpen);
        });
      })
      .catch((error: AxiosError) => {
        console.log("error : ", error);
        return false;
      });
  };

  getNotice = async (monitorList: MonitorListDto[], monitorName: string) => {
    const monitorId = monitorList.find(
      (monitor: MonitorListDto) => monitor.name === monitorName
    ).id;
    await this.api
      .get(ServerUrlType.APIS, `/api/noti/id/${monitorId}`)
      .then((result: AxiosResponse<MonitorNoticeDto>) => {
        runInAction(() => {
          this.notice = result.data[0].noti;
        });
      })
      .catch((error: AxiosError) => {
        console.log("error : ", error);
        return false;
      });
  };

  insertBroadcast = async (value: string, type: string) => {
    const params = {
      enterprise: this.auth.enterprise,
      data: {
        noti: value,
      },
    };

    if (type === "monitor") {
      params.data["monitor"] = this.mountedList.id.toString();
      params.data["type"] = SocketBroadcastType.NOTICE;
    } else {
      params.data["type"] = SocketBroadcastType.RELOAD;
    }

    await this.api
      .post(ServerUrlType.EDGE, "/api/edge/broadcast", params)
      .then((result: AxiosResponse) => {})
      .catch((error: AxiosError) => {
        console.log("error : ", error);
        return false;
      });
  };

  insertNotice = async (value: string) => {
    await this.api
      .post(ServerUrlType.APIS, "/api/noti/", {
        monitor_id: this.mountedList.id.toString(),
        noti: value,
      })
      .then((result: AxiosResponse) => {
        this.insertBroadcast(value, "monitor");
      })
      .catch((error: AxiosError) => {
        console.log("error : ", error);
        return false;
      });
  };

  insertNoticeAll = async (value: string) => {
    this.insertBroadcast(value, "all");
    await this.api
      .post(ServerUrlType.APIS, "/api/noti/al", {
        noti: value,
      })
      .then((result: AxiosResponse) => {})
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

  onMessage = async (response: MessageEvent) => {
    if (typeof response.data === "object" && this.machines.length > 0) {
      //바이너리 메시지
      const updateData = await response.data.text();
      const dataArray = updateData.split("|");
      switch (dataArray[1]) {
        case BinaryMessageType.NOTI:
          const matchDataForNoti = this.machines.find(
            (data) => +data?.id === +dataArray[4]
          );

          if (matchDataForNoti) {
            const mappingNoti = mapperInstance.notiMapper(
              dataArray,
              matchDataForNoti
            );
            this.handleNoti(mappingNoti);
          }
          break;
        case BinaryMessageType.PART_COUNT:
          const matchDataForPartCount = this.machines.find(
            (data) => +data.id === +dataArray[13]
          );

          if (matchDataForPartCount) {
            const mappingPartCount = mapperInstance.partCountMapper(
              dataArray,
              matchDataForPartCount
            );
            this.handlePartCount(mappingPartCount);
          }
          break;
        case BinaryMessageType.MESSAGE || BinaryMessageType.ALARM:
          const matchDataForMessage = this.machines.find(
            (data) => +data.id === +dataArray[6]
          );

          if (matchDataForMessage) {
            this.handleMessage(matchDataForMessage);
          }
          break;
      }
    } else {
      //오브젝트 메시지
      const objectMessage = JSON.parse(response.data);

      switch (objectMessage.response) {
        case SocketResponseType.MACHINE:
          //object
          this.handleMachineStat(objectMessage.data);
          break;
        case SocketResponseType.BROADCAST:
          if (objectMessage.data.type === SocketBroadcastType.NOTICE) {
            if (this.checkNoticeUpdate(objectMessage)) {
              runInAction(() => {
                this.notice = objectMessage.data.noti;
              });
            }
          } else {
            location.reload();
          }
          break;
        case SocketResponseType.CONNECT:
          runInAction(() => {
            this.unMount = false;
          });
          break;
        case SocketResponseType.CLOSED:
          if (!this.unMount) {
            location.reload();
          }
          break;
      }
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

  handleNoti = (mappingNoti: MachineDto) => {
    const newMachinesByNoti: MachineDto[] = [];

    for (let i = 0; i < this.machines.length; i++) {
      if (this.machines[i].id === mappingNoti.id) {
        newMachinesByNoti[i] = mappingNoti;
      } else {
        newMachinesByNoti[i] = this.machines[i];
      }
    }

    runInAction(() => {
      this.machines = newMachinesByNoti;
    });
  };

  handlePartCount = (mappingPartCount: MachineDto) => {
    const newMachinesByPartCount: MachineDto[] = [];

    for (let i = 0; i < this.machines.length; i++) {
      if (this.machines[i].id === mappingPartCount.id) {
        newMachinesByPartCount[i] = mappingPartCount;
      } else {
        newMachinesByPartCount[i] = this.machines[i];
      }
    }

    runInAction(() => {
      this.machines = newMachinesByPartCount;
    });
  };

  handleMachineStat = (statArray) => {
    const newMachines: MachineDto[] = [];

    for (let i = 0; i < statArray.length; i++) {
      const matchData = this.machines.find(
        (data) => +data.id === +statArray[i].Id
      );
      if (matchData) {
        const result = mapperInstance.machineStatMapper(
          statArray[i],
          matchData
        );
        newMachines.push(result);
      }
    }

    runInAction(() => {
      this.machines = newMachines.sort((a, b) => a.machineNo - b.machineNo);

      this.setMountByMonitor();
    });
  };

  handleMessage = (matchData: MachineDto) => {
    const newMachinesByMessage: MachineDto[] = [];

    for (let i = 0; i < this.machines.length; i++) {
      if (this.machines[i].id === matchData.id) {
        newMachinesByMessage[i] = { ...matchData, isReceiveMessage: true };
      } else {
        newMachinesByMessage[i] = this.machines[i];
      }
    }

    runInAction(() => {
      this.machines = newMachinesByMessage;
    });
  };

  checkNoticeUpdate = (objectMessage) => {
    let result = true;

    if (objectMessage.enterprise !== this.auth.enterprise) {
      result = false;
    }

    if (+objectMessage.data.monitor !== this.mountedList.id) {
      result = false;
    }
    return result;
  };

  setMountByMonitor = () => {
    const newMachines = this.mountedList.machines.map((order: number) => {
      return this.machines.find((machine: MachineDto) => +machine.id === order);
    });

    runInAction(() => {
      this.machines = newMachines;
    });
  };
}
