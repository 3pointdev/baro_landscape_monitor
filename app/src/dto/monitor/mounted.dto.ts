import { Expose } from "class-transformer";

export default class MountedDto {
  @Expose({ name: "M" })
  public readonly machines: number[] = [];

  @Expose({ name: "enterprise_id" })
  public readonly enterpriseId: number = 0;

  @Expose({ name: "id" })
  public readonly id: number = 0;

  @Expose({ name: "loginid" })
  public readonly loginId: string = "";

  @Expose({ name: "name" })
  public readonly name: string = "";

  @Expose({ name: "regdate" })
  public readonly regdate: "";

  @Expose({ name: "status" })
  public readonly status: string = "";
}
