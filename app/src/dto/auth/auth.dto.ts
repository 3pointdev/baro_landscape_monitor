import { Expose } from "class-transformer";

export default class AuthDto {
  @Expose({ name: "account" })
  public readonly account: string = "";

  @Expose({ name: "name" })
  public readonly name: string = "";

  @Expose({ name: "enterprise_id" })
  public readonly enterpriseId: number = 0;

  @Expose({ name: "enterprise" })
  public readonly enterprise: string = "";

  @Expose({ name: "token" })
  public readonly token: string = "";
}
