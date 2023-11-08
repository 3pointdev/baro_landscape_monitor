import { Type } from "class-transformer";
import MonitorDto from "./monitor.dto";

export default class MonitorListDto {
  @Type(() => MonitorDto)
  public readonly data: MonitorDto[] = [];
  public readonly id: number = 0;
  public readonly name: string = "";
}
