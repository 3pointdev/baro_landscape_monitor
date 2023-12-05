export class SocketModule {
  public socket: WebSocket;
  public url: string;
  public readyState: number;
  public pingIntervalSeconds: number = 20000;
  public intervalId: any;
  public sender: string;

  constructor(company: string, target: number) {
    this.sender = window.localStorage.sender;
    this.url = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}${this.sender}?ent=${company}&view=mid:${target}`;
    this.connect = this.connect.bind(this);
  }

  public connect(
    onMessage: (message) => void,
    onOpen: () => void,
    onClose: () => void
  ) {
    this.socket = new WebSocket(this.url, "transmitter");
    this.socket.onopen = onOpen;
    this.socket.onmessage = onMessage;
    this.socket.onerror = this.onError;
    this.socket.onclose = onClose;
  }

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
