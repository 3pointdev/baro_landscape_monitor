import { Expose } from "class-transformer";

export default class MachineSummaryDto {
  @Expose({ name: "id" })
  public readonly id: number = 0;

  @Expose({ name: "name" })
  public readonly mid: string = "";

  @Expose({ name: "machine_no" })
  public readonly machineNo: string = "";
}
