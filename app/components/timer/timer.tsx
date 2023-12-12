import dayjs, { Dayjs } from "dayjs";
import { StyleColor } from "public/color";
import { CSSProperties, useEffect, useState } from "react";
import styled from "styled-components";

interface IProps {
  fontSize?: number;
  color?: string;
  style?: CSSProperties;
  wideFont?: number;
  fontweight?: number;
  fontFamily?: string;
}

export default function Timer({
  fontSize,
  color,
  style,
  wideFont,
  fontweight,
  fontFamily,
}: IProps) {
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
    <Container
      fontSize={fontSize}
      wideFont={wideFont}
      fontweight={fontweight}
      fontFamily={fontFamily ? fontFamily : "pretendard"}
      color={color}
      style={style}
    >
      <span>{dayjs(time).format("YYYY.MM.DD")}</span>
      <span>{dayjs(time).format("HH:mm:ss")}</span>
    </Container>
  );
}

const Container = styled.div<{
  fontSize: number;
  color: string;
  wideFont: number;
  fontweight: number;
  fontFamily: string;
}>`
  font-family: "${({ fontFamily }) => fontFamily}", monospace;
  display: flex;
  align-items: center;
  font-variant-numeric: tabular-nums;
  gap: 0.8vw;
  & span {
    color: ${({ color }) => (color ? color : StyleColor.LIGHT)};
    font-size: ${({ fontSize, wideFont }) =>
      wideFont ? `${wideFont}vw` : `${fontSize}px`};
    font-weight: ${({ fontweight }) => fontweight};
  }
`;
