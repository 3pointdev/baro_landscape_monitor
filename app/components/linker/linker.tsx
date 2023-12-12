import Link from "next/link";
import { CSSProperties, MouseEventHandler, ReactElement } from "react";
import styled from "styled-components";

interface IProps {
  href?: string;
  onClick?: MouseEventHandler;
  onMouseEnter?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
  boxStyle?: CSSProperties;
  style?: CSSProperties;
  children?: ReactElement | ReactElement[] | string | string[];
  className?: string;
}

export default function Linker(props: IProps) {
  const {
    href,
    children,
    style,
    boxStyle,
    onClick,
    onMouseEnter,
    onMouseLeave,
    className,
  } = props;

  return (
    <LinkerContainer style={boxStyle} className={className}>
      <Link
        href={href ? href : ""}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {children}
      </Link>
    </LinkerContainer>
  );
}

const LinkerContainer = styled.div`
  width: 100%;
  height: 100%;

  & a {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
`;
