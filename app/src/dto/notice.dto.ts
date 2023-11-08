import { Expose } from "class-transformer";

export default class MonitorNoticeDto {
  @Expose({ name: "id" })
  public readonly id: number = 0;

  @Expose({ name: "enterprise_id" })
  public readonly enterpriseId: number = 0;

  @Expose({ name: "mon_id" })
  public readonly monId: number = 0;

  @Expose({ name: "noti" })
  public readonly noti: string = "";
}
