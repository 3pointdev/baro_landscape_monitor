import MonitorItem from "components/monitor/monitorItem";
import Timer from "components/timer/timer";
import { inject, observer } from "mobx-react";
import { NextRouter } from "next/router";
import { StyleColor } from "public/color";
import BarofactorySquare from "public/images/logo/barofactory-square";
import { useEffect, useRef, useState } from "react";
import MachineDto from "src/dto/machine/machine.dto";
import TableModel from "src/model/table/table.model";
import ViewModel from "src/viewModel/viewModel";
import styled from "styled-components";

interface IProps {
  viewModel: ViewModel;
  router: NextRouter;
}

function Home({ viewModel }: IProps) {
  const [viewMonitorNumber, setViewMonitorNumber] = useState<number>(0);
  const monitorRef = useRef(0);

  useEffect(() => {
    viewModel.getMachineList();

    setTimeout(() => {
      location.reload();
    }, 1200000);

    const changeMonitorInterval = setInterval(() => {
      const maxMonitor = viewModel.machines.length / 13 - 1;
      if (maxMonitor > 0) {
        if (monitorRef.current < maxMonitor) {
          setViewMonitorNumber((monitorRef.current += 1));
        } else {
          monitorRef.current = 0;
          setViewMonitorNumber(0);
        }
      } else {
        clearInterval(changeMonitorInterval);
      }
    }, 10000);

    return () => {
      viewModel.socketDisconnect();
      clearInterval(changeMonitorInterval);
    };
  }, []);

  return (
    <MonitoringContainer>
      <HeadLine>
        <LeftSide>
          <BarofactorySquare color={StyleColor.LIGHT} />
          <h2>바로팩토리 | 공정현황</h2>
        </LeftSide>
        <Timer wideFont={1.8} fontweight={600} />
      </HeadLine>
      <MonitoringTable>
        <thead>
          <tr>
            {tableHeader.map((head: TableModel, key: number) => {
              return (
                <TableHead
                  key={`monitoring_table_header_${key}`}
                  size={head.size}
                  align={head.align}
                  className={`${head.align}_align`}
                >
                  {head.title}
                </TableHead>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {viewModel.machines.map((data: MachineDto, key: number) => {
            const startKey = viewMonitorNumber * 13;
            const endKey = startKey + 13;

            if (startKey <= key && endKey > key)
              return (
                <MonitorItem data={data} key={`monitoring_table_row_${key}`} />
              );
          })}
        </tbody>
      </MonitoringTable>
    </MonitoringContainer>
  );
}

export default inject("viewModel")(observer(Home));

const MonitoringContainer = styled.div`
  background: ${StyleColor.DARKBACKGROUND};
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const HeadLine = styled.header`
  width: calc(100vw - 1.6vw);
  height: 6.6vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.8vw;
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8vw;

  & svg {
    width: 3.6vw;
    max-width: 152px;
    height: 3.6vh;
  }

  & h2 {
    font-size: 1.8vw;
    font-weight: 500;
    color: ${StyleColor.LIGHT};
  }
`;

const MonitoringTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  & thead {
    background: ${StyleColor.DARKEMPHASIS};
    height: 6vh;
  }
`;

const TableHead = styled.th<{ size: string | number }>`
  font-size: 1.8vw;
  font-weight: 500;
  color: ${StyleColor.LIGHT};
  width: ${({ size }) => size}vw;

  &.left_align {
    text-align: left;
    padding-left: 0.6vw;
  }

  &.fit {
    width: 182px !important;
  }
`;

const tableHeader: TableModel[] = [
  {
    title: "No",
    align: "center",
    size: 4,
  },
  {
    title: "기계명",
    align: "left",
    size: 16,
  },
  {
    title: "가공명",
    align: "left",
    size: 30,
  },

  {
    title: "완료예정일",
    align: "center",
    size: 14,
  },
  {
    title: "실C/T",
    align: "center",
    size: 6,
  },
  {
    title: "완료/목표(%)",
    align: "center",
    size: 20,
  },

  {
    title: "현재상태",
    align: "center",
    size: 10,
  },
];
