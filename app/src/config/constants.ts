export const NUMBERSEENMONITORING2 = 4;

/**
 * 서버주소 타입
 */
export const ServerUrlType = {
  BARO: process.env.NEXT_PUBLIC_BARO_URL,
  APIS: process.env.NEXT_PUBLIC_APIS_URL,
  EDGE: process.env.NEXT_PUBLIC_EDGE_API_URL,
  WEBSOCKET: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
} as const;
export type ServerUrlType = (typeof ServerUrlType)[keyof typeof ServerUrlType];

/**
 * 소켓 리스폰스 타입
 */
export const SocketResponseType = {
  MACHINE: "EDGE_MACHINES_STAT",
  CALL_FUNC: "CALL_FUNC_RESULT",
  CALL_FUNC_FAIL: "CALL_FUNC_FAIL",
  CONNECT: "EDGE_CONNECT",
  CLOSED: "EDGE_CLOSED",
  BROADCAST: "BROADCAST",
} as const;
export type SocketResponseType =
  (typeof SocketResponseType)[keyof typeof SocketResponseType];

/**
 * Socket Broadcast 타입
 */
export const SocketBroadcastType = {
  NOTICE: "notice",
  RELOAD: "reload",
} as const;
export type SocketBroadcastType =
  (typeof SocketBroadcastType)[keyof typeof SocketBroadcastType];

/**
 * 머신상태타입
 */
export const MachineExecutionType = {
  ACTIVE: "ACTIVE",
  OFF: "POWER_OFF",
  READY: "READY",
  TRIGGERED: "TRIGGERED",
  STOPPED: "STOPPED",
  INTERRUPTED: "INTERRUPTED",
} as const;
export type MachineExecutionType =
  (typeof MachineExecutionType)[keyof typeof MachineExecutionType];

/**
 * 머신구분타입
 */
export const MachineStateType = {
  OFF: "off",
  MODIFY: "modify",
  ALARM: "alarm",
  RUNNING: "runing",
  READY: "ready",
  EMERGENCY_STOP: "emergency_stop",
  SUCCESS: "success",
  WAIT: "wait",
} as const;
export type MachineStateType =
  (typeof MachineStateType)[keyof typeof MachineStateType];

/**
 * 바이너리 메시지 타입
 */
export const BinaryMessageType = {
  PART_COUNT: "PART_COUNT",
  NOTI: "NOTI",
  MESSAGE: "MESSAGE",
  ALARM: "ALARM",
} as const;
export type BinaryMessageType =
  (typeof BinaryMessageType)[keyof typeof BinaryMessageType];

/**
 * 기계 상황별 색상 타입
 */
export const MachineColorType = {
  GREEN: "#2F983E",
  YELLOW: "#F2994A",
  RED: "#D11313",
  GRAY: "#777",
} as const;
export type MachineColorType =
  (typeof MachineColorType)[keyof typeof MachineColorType];

/**
 * 기계 상황별 텍스트 타입
 */
export const MachineTextType = {
  ACTIVE: "가공 중",
  SUCCESS: "가공완료",
  READY: "대기 중",
  MODIFY: "수정 중",
  PAUSE: "일시정지",
  EMERGENCY: "비상정지",
  ALARM: "알람발생",
  OFF: "전원꺼짐",
} as const;
export type MachineTextType =
  (typeof MachineTextType)[keyof typeof MachineTextType];

/**
 * 특수 블럭 코드 타입
 */
export const ExceptionBlockType = {
  PAUSE: ["M0", "M00", "M1", "M01", "M61", "M62"],
  PALETTE: ["M61", "M62"],
} as const;
export type ExceptionBlockType =
  (typeof ExceptionBlockType)[keyof typeof ExceptionBlockType];
