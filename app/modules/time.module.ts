import dayjs from "dayjs";

class TimeModule {
  public secToString(time: number) {
    if (typeof time !== "number" || isNaN(time) || time < 0) {
      return "0시간 0분 0초";
    }

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    let result = "";

    if (hours > 0) {
      result += `${hours}시간`;
    }

    if (minutes > 0) {
      if (result.length > 0) {
        result += " ";
      }
      result += `${minutes}분`;
    }

    if (seconds > 0) {
      if (result.length > 0) {
        result += " ";
      }
      result += `${seconds}초`;
    }

    return result;
  }

  public getRemainingTime(targetDateTime: string) {
    const target = dayjs(targetDateTime, "YYYY-MM-DD HH:mm:ss");
    const current = dayjs();

    const duration = target.diff(current);
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration / 60000) % 60);
    const seconds = Math.floor((duration / 1000) % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  /**
   * ms를 입력받아 시간형태로 리턴
   * ex) 1시간 미만 21:31
   * ex) 1시간 이상 02:21:31
   */
  public msToHHMM(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms / 60000) % 60);
    const seconds = Math.floor((ms / 1000) % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  }

  /**
   * ms를 입력받아 시간형태로 리턴
   * ex) 1시간 미만 00:21:31
   * ex) 1시간 이상 02:21:31
   */
  public msToTime(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms / 60000) % 60);
    const seconds = Math.floor((ms / 1000) % 60);

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  /**
   * seconds를 입력받아 시간형태로 리턴
   * ex) 1시간 미만 00:21:31
   * ex) 1시간 이상 02:21:31
   */
  public secToTime(sec: number): string {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec / 60) % 60);
    const seconds = sec % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  public getTimeDifferenceInMs(time1: string, time2: string) {
    const date1 = dayjs(time1);
    const date2 = dayjs(time2);
    const timeDiffInMs = date2.diff(date1);
    return timeDiffInMs;
  }

  public msToString(millisecond: number): string {
    const totalSeconds = Math.floor(millisecond / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const hoursText = hours > 0 ? `${hours} 시간 ` : "";
    const minutesText = minutes > 0 ? `${minutes} 분` : "";

    return hoursText + minutesText;
  }
}

const timeInstance = new TimeModule();
export default timeInstance;
