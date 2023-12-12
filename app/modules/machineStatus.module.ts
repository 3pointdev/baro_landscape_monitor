import {
  MachineColorType,
  MachineExecutionType,
  MachineTextType,
} from "src/config/constants";

class MachineStatusModule {
  /**
   * 머신 상태 별 텍스트 추출 함수
   * @param execution : string
   * @param mode : string
   * @param isPause : boolean
   * @param isReceiveMessage : boolean
   * @param isReceivePartCount: boolean
   * @param isChangePalette: boolean
   * @returns color : string
   */
  public ToTextStatus(
    execution: string,
    mode: string,
    isPause: boolean,
    isReceiveMessage: boolean,
    isReceivePartCount: boolean,
    isChangePalette: boolean
  ): MachineTextType {
    if (execution === MachineExecutionType.OFF) return MachineTextType.OFF;
    if (isReceiveMessage) return MachineTextType.ALARM;
    if (mode !== "AUTOMATIC") return MachineTextType.MODIFY;
    if (isPause) return MachineTextType.PAUSE;

    switch (execution) {
      case MachineExecutionType.ACTIVE:
        return MachineTextType.ACTIVE;
      case MachineExecutionType.READY:
        return MachineTextType.READY;
      case MachineExecutionType.TRIGGERED:
        return MachineTextType.EMERGENCY;
      case MachineExecutionType.STOPPED:
        if (isReceivePartCount || isChangePalette) {
          return MachineTextType.SUCCESS;
        } else {
          return MachineTextType.READY;
        }
      case MachineExecutionType.INTERRUPTED:
        if (isReceivePartCount || isChangePalette) {
          return MachineTextType.SUCCESS;
        } else {
          return MachineTextType.READY;
        }
    }
  }

  /**
   * 머신 상태 별 색상 추출 함수
   * @param execution : string
   * @param mode : string
   * @param isPause : boolean
   * @param isReceiveMessage : boolean
   * @returns color : string
   */
  public ToColorStatus(
    execution: string,
    mode: string,
    isPause: boolean,
    isReceiveMessage: boolean
  ): MachineColorType {
    //전원 OFF
    if (execution === MachineExecutionType.OFF || execution === "")
      return MachineColorType.GRAY;

    //비상정지
    if (execution === MachineExecutionType.TRIGGERED || isReceiveMessage)
      return MachineColorType.RED;

    //수동조작 수정작업 중
    if (mode !== "AUTOMATIC" || isPause) return MachineColorType.YELLOW;

    //일시정지, 대기, 작업중단
    if (
      execution === MachineExecutionType.STOPPED ||
      execution === MachineExecutionType.INTERRUPTED ||
      execution === MachineExecutionType.READY
    )
      return MachineColorType.YELLOW;

    //가공 중
    if (execution === MachineExecutionType.ACTIVE)
      return MachineColorType.GREEN;
  }

  /**
   * 머신 상태 별 색상 추출 함수
   * @param execution : string
   * @param mode : string
   * @param isPause : boolean
   * @param isReceiveMessage : boolean
   * @returns color : string
   */
  public ToDashBoardColor(execution: string): MachineColorType {
    switch (execution) {
      case MachineExecutionType.OFF:
        return MachineColorType.GRAY;
      case MachineExecutionType.TRIGGERED:
        return MachineColorType.RED;
      default:
        return MachineColorType.GREEN;
    }
  }
}

const machineStatusInstance = new MachineStatusModule();
export default machineStatusInstance;
