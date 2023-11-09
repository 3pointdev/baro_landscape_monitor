import dayjs from "dayjs";
import machineStatusInstance from "modules/machineStatus.module";
import timeInstance from "modules/time.module";
import { StyleColor } from "public/color";
import { useEffect, useState } from "react";
import {
  MachineColorType,
  MachineExecutionType,
  MachineTextType,
} from "src/config/constants";
import styled, { keyframes } from "styled-components";
import MachineDto from "../../src/dto/machine/machine.dto";

interface IProps {
  data: MachineDto;
}

export default function MonitorItem({ data }: IProps) {
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [executionText, setExecutionText] = useState<string>(
    MachineTextType.MODIFY
  );
  const [color, setColor] = useState<string>(MachineColorType.YELLOW);

  useEffect(() => {
    const newExecutionText = machineStatusInstance.ToTextStatus(
      data.execution,
      data.mode,
      data.pause,
      data.isReceiveMessage,
      data.isReceivePartCount,
      data.isChangePalette
    );
    const newColor = machineStatusInstance.ToColorStatus(
      data.execution,
      data.mode,
      data.pause,
      data.isReceiveMessage
    );
    setExecutionText(newExecutionText);
    setColor(newColor);
    setIsDisable(newExecutionText === MachineTextType.OFF);
  }, [
    data.execution,
    data.mode,
    data.pause,
    data.isReceiveMessage,
    data.isReceivePartCount,
    data.isChangePalette,
  ]);

  return (
    <TableRow disable={isDisable}>
      <td align={"center"}>
        <MachineNumber color={color}>{data.machineNo}</MachineNumber>
      </td>
      <td align={"left"} className="mid">
        {data.mid}
      </td>
      {data.execution !== MachineExecutionType.OFF ? (
        // 머신이 켜진경우
        <>
          <td
            align={"left"}
            className={
              data.program?.length > 26 ? "is_long_column program" : "program"
            }
          >
            <p>{data.program}</p>
          </td>
          <td align={"center"} className="tabular_nums">
            {/* 완료예상시각이 있는 경우 */}
            {data.prdctEnd && dayjs(data.prdctEnd).format("MM/DD HH:mm")}
          </td>
          <td align={"center"} className="tabular_nums">
            {timeInstance.msToHHMM(+data.period + data.wait)}
          </td>
          <td align={"center"} className="counter">
            <span
              style={{
                color:
                  data.partCount >= data.planCount
                    ? StyleColor.FINISH
                    : StyleColor.LIGHT,
              }}
            >
              {data.partCount}
            </span>
            <span>/</span>
            <span className={data.planCount > 0 ? "" : "warning"}>
              {/* 목표수량을 입력한경우 ? 목표수량 : 미입력(빨강) */}
              {data.planCount > 0 ? data.planCount : "미입력"}
            </span>
            {data.planCount > 0 && (
              // 목표수량을 입력한 경우
              <span
                style={{
                  color:
                    data.partCount >= data.planCount
                      ? StyleColor.FINISH
                      : StyleColor.LIGHT,
                }}
              >{`(${Math.floor(
                (data.partCount / data.planCount) * 100
              )}%)`}</span>
            )}
          </td>
        </>
      ) : (
        // 머신이 꺼진경우
        <>
          <td />
          <td />
          <td />
          <td />
        </>
      )}
      <td align={"center"}>
        <Execution color={color}>{executionText}</Execution>
      </td>
    </TableRow>
  );
}

const textScroll = keyframes`

  0%{
    transform:translateX(105%);
    -moz-transform:translateX(105%);
    -webkit-transform:translateX(105%);
    -o-transform:translateX(105%);
    -ms-transform:translateX(105%);
  }

  40% {
    transform:translateX(0%);
    -moz-transform:translateX(0%);
    -webkit-transform:translateX(0%);
    -o-transform:translateX(0%);
    -ms-transform:translateX(0%);
  }
  60% {
    transform:translateX(0%);
    -moz-transform:translateX(0%);
    -webkit-transform:translateX(0%);
    -o-transform:translateX(0%);
    -ms-transform:translateX(0%);
  }
  
  100%{
    transform:translateX(-105%);
    -moz-transform:translateX(-105%);
    -webkit-transform:translateX(-105%);
    -o-transform:translateX(-105%);
    -ms-transform:translateX(-105%);
  }
`;

const TableRow = styled.tr<{ disable: boolean }>`
  height: 6.7vh;

  & td {
    overflow: hidden;
  }

  & .mid {
    max-width: 15vw !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.9vw;
  }

  & .program {
    max-width: 20vw !important;
  }
  .counter {
    max-width: 20vw !important;
  }

  & .warning {
    color: ${({ disable }) =>
      disable ? StyleColor.DISABLE : StyleColor.WARNNING} !important;
  }

  & td,
  td p,
  td span {
    white-space: nowrap;
    font-size: 1.9vw;
    line-height: 2vw;
    font-weight: 600;
    color: ${({ disable }) =>
      disable ? StyleColor.DISABLE : StyleColor.LIGHT} !important;

    &.is_long_column p {
      width: fit-content;
      animation: ${textScroll} 10s linear infinite;
    }
  }

  & .tabular_nums {
    font-variant-numeric: tabular-nums;
  }
`;

const MachineNumber = styled.div<{ color: string }>`
  text-align: center;
  width: 5vh;
  line-height: 5.4vh;
  height: 5.4vh;
  border-radius: 0.6vw;
  font-size: 2vw;
  background: ${({ color }) => color};
  color: ${StyleColor.LIGHT};
`;

const Execution = styled.div<{ color: string }>`
  height: 5.4vh;
  border-radius: 0.6vw;
  line-height: 5.4vh;
  background: ${({ color }) => color};
  color: ${StyleColor.LIGHT};
  text-align: center;
  font-size: 2vw;
  font-weight: 700;
`;
