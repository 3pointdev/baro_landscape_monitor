import dayjs, { Dayjs } from "dayjs";
import { StyleColor } from "public/color";
import { CSSProperties, useEffect, useState } from "react";
import styled from "styled-components";

export default function Timer({
  size,
  style,
}: {
  size?: string;
  style?: CSSProperties;
}) {
  const [time, setTime] = useState<Dayjs>(null);

  const getTime = () => {
    return dayjs();
  };

  useEffect(() => {
    setTime(getTime());
    const interval = setInterval(() => {
      setTime(getTime());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <TimeWrap style={style} className={size ? size : ""}>
      <Date className={size ? size : ""}>
        {dayjs(time).format("YYYY.MM.DD")}
      </Date>
      <Time className={size ? size : ""}>{dayjs(time).format("HH:mm:ss")}</Time>
    </TimeWrap>
  );
}

const TimeWrap = styled.div`
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  gap: 24px;

  &.small {
    gap: 4px;
  }

  &.midium {
    left: 40px;
    gap: 0px;
  }
`;

const Date = styled.span`
  flex-shrink: 0;
  font-weight: 600;
  width: 260px;
  max-width: fit-content;
  color: ${StyleColor.DARK}95;
  font-size: 48px;
  font-weight: 400;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;

  @media screen and (max-width: 660px) {
    font-size: 36px;
  }

  &.small {
    padding: 0 8px;
    width: 120px;
    max-width: none;
    font-size: 20px !important;
    font-weight: 600;

    @media screen and (min-width: 1080px) {
      font-size: 20px;
    }
  }

  &.midium {
    padding: 0 8px;
    width: 196px !important;
    max-width: none;
    font-size: 32px !important;
    font-weight: 600;
    margin-left: 40px;
  }
`;

const Time = styled.span`
  flex-shrink: 0;
  font-weight: 600;
  width: 210px;
  min-width: fit-content;
  color: ${StyleColor.DARK}95;
  font-size: 48px;
  font-weight: 600;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  text-align: start;
  @media screen and (max-width: 660px) {
    font-size: 36px;
  }

  &.small {
    width: 96px !important;
    min-width: fit-content;
    font-size: 20px !important;
    letter-spacing: 1px;

    @media screen and (min-width: 1080px) {
      font-size: 20px;
    }
  }

  &.midium {
    padding: 0 8px;
    width: 120px;
    max-width: none;
    font-size: 32px !important;
  }
`;
