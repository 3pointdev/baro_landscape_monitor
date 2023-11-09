import { AxiosError, AxiosResponse } from "axios";
import { action, makeObservable, observable, runInAction } from "mobx";
import { ServerResponse } from "modules/api.module";
import mapperInstance from "modules/mapper.module";
import {
  BinaryMessageType,
  ServerUrlType,
  SocketResponseType,
} from "src/config/constants";
import MachineDto from "src/dto/machine/machine.dto";
import DefaultViewModel, { IDefaultProps } from "./default.viewModel";

export default class ViewModel extends DefaultViewModel {
  public machines: MachineDto[] = [];
  public unMount: boolean = false;

  constructor(props: IDefaultProps) {
    super(props);

    makeObservable(this, {
      machines: observable,

      onMessage: action,
      getMachineList: action,
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

  getMachineList = async () => {
    await this.api
      .get(ServerUrlType.BARO, "/machine/currentList")
      .then((result: AxiosResponse<any[]>) => {
        const data = result.data.map((machine) =>
          mapperInstance.currentListMapper(machine)
        );
        runInAction(() => {
          this.machines = data;
          this.initializeSocket(this.onMessage, this.onOpen);
        });
      })
      .catch((error: AxiosError) => {
        console.log("error : ", error);
        return false;
      });
  };

  public updateData = (target: MachineDto) => {
    //prdct_end의 계산,저장시간을 고려하여 2초딜레이처리
    setTimeout(async () => {
      await this.api
        .get(ServerUrlType.BARO, "/mon/prd_end/" + target.id)
        .then((result: AxiosResponse<{ prdct_end: string }[]>) => {
          const newTime = result.data[0].prdct_end;
          const newTarget = { ...target, prdctEnd: newTime };

          this.handlePartCount(newTarget);
        })
        .catch((error: AxiosError) => {
          console.log("error : ", error);
          return false;
        });
    }, 2000);
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
    if (typeof response.data === "object") {
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

          if (+dataArray[5] > 5 && matchDataForPartCount.prdctEnd) {
            this.updateData(matchDataForPartCount);
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
      this.machines = newMachines.sort((a, b) => +a.machineNo - +b.machineNo);
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
}
