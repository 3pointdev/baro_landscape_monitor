import { Expose } from "class-transformer";

export default class MonitorDto {
  @Expose({ name: "id" })
  public readonly id: number = 0;

  @Expose({ name: "item_id" })
  public readonly itemId: number = 0;

  @Expose({ name: "machine_no" })
  public readonly machineNo: string = "";

  @Expose({ name: "mid" })
  public readonly mid: string = "";

  @Expose({ name: "mkey" })
  public readonly mkey: number = 0;

  @Expose({ name: "monitor" })
  public readonly monitor: string = "";

  @Expose({ name: "ord" })
  public readonly ord: number = 0;
}
