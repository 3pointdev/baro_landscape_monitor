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
