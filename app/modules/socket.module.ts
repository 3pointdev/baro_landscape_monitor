import { makeObservable, observable } from "mobx";
import MachineDto from "src/dto/machine/machine.dto";

interface IProps {
  onMessage: (response: MessageEvent) => void;
  company: string;
  sender: string;
  isAll?: boolean;
}

export class SocketModule {
  public socket: WebSocket;
  public url: string;
  public readyState: number;
  public pingIntervalSeconds: number = 20000;
  public intervalId: any;
  public sender: string;
  public machine: MachineDto[] = [];

  constructor(company: string) {
    this.sender = window.localStorage.sender;
    this.url = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}${this.sender}?ent=${company}&view=noti`;
    this.connect = this.connect.bind(this);

    makeObservable(this, {
      machine: observable,
    });
  }

  public connect(onMessage: (message) => void, onOpen: () => void) {
    this.socket = new WebSocket(this.url, "transmitter");
    this.socket.onopen = onOpen;
    this.socket.onmessage = onMessage;
    this.socket.onerror = this.onError;
    this.socket.onclose = this.onClose;
  }

  public onClose = () => {
    console.log("WebSocket closed");

    console.log("try reload");
    location.reload();
  };

  public onError = (error) => {
    console.error("WebSocket error:", error);
  };

  public disconnect = () => {
    this.socket.close(); // 소켓 연결 해제
  };

  public sendEvent = <T>(data: T) => {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  };
}
