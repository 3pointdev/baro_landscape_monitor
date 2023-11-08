import dayjs from "dayjs";

export default class NotificationModel {
  public startDay: string = dayjs(new Date()).format("YYYY-MM-DD");
  public endDay: string = dayjs(new Date()).format("YYYY-MM-DD");
  public mkey: number = 0;
  public searchKeyword: string = "";
}
