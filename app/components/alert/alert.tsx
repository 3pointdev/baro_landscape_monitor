import {
  faCheckCircle,
  faXmarkCircle,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StyleColor } from "public/color";
import { CSSProperties } from "react";
import styled, { css, keyframes } from "styled-components";

export interface IAlertState {
  isPositive?: boolean;
  isActive: boolean;
  title: string;
  sec?: number;
  fontColor?: string;
  background?: string;
  style?: CSSProperties;
}

export default function Alert({
  title,
  isActive,
  isPositive = true,
  sec = 3,
  fontColor = StyleColor.LIGHT,
  background,
  style,
}: IAlertState) {
  if (isActive)
    return (
      <Container
        isPositive={isPositive}
        isActive={isActive}
        color={fontColor}
        background={background}
        style={style}
      >
        <FontAwesomeIcon
          icon={isPositive ? faCheckCircle : faXmarkCircle}
          size="xl"
        />
        <Title>{title}</Title>
        <ProgressBar
          isPositive={isPositive}
          isActive={isActive}
          seconds={sec}
          background={background}
        >
          <span />
        </ProgressBar>
      </Container>
    );
}

const Container = styled.div<{
  isPositive: boolean;
  isActive: boolean;
  color: string;
  background: string;
}>`
  z-index: 999;
  position: fixed;
  right: 16px;
  bottom: ${({ isActive }) => (isActive ? "16px" : "-200px")};
  border-radius: 8px;
  padding: 16px 24px;
  background: ${({ isPositive, background }) =>
    background
      ? background
      : isPositive
      ? StyleColor.POSITIVE
      : StyleColor.WARNNING};
  display: flex;
  align-items: center;
  gap: 16px;

  transition: all 0.2s ease;

  & * {
    color: ${({ color }) => color};
  }
`;

const Title = styled.p`
  white-space: pre-line;
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
`;

const Progress = keyframes`
from {
    width: 0%;
}
to {
    width: 100%;
    
}
`;

const ProgressBar = styled.div<{
  isPositive: boolean;
  isActive: boolean;
  seconds: number;
  background: string;
}>`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  background: ${StyleColor.DISABLE};
  height: 6px;
  border-radius: 0 0 16px 16px;

  & span {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 0%;
    height: 6px;
    border-radius: 0 0 16px 16px;
    background: ${({ isPositive, background }) =>
      background
        ? background
        : isPositive
        ? StyleColor.POSITIVE
        : StyleColor.WARNNING};
    ${({ isActive, seconds }) =>
      isActive &&
      css`
        animation: ${Progress} ${seconds}s ease forwards;
      `};
  }
`;
