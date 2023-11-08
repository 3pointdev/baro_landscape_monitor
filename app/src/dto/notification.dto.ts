import { Expose } from "class-transformer";

export default class NotificationDto {
  @Expose({ name: "date" })
  public readonly date: string = "";

  @Expose({ name: "message" })
  public readonly message: string = "";

  @Expose({ name: "mid" })
  public readonly mid: string = "";

  //   @Expose({ name: "msg_type" })
  //   public readonly msgType?: string;

  //   @Expose({ name: "note" })
  //   public readonly note?: string;
}
