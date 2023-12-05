import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import CustomDirectionalLight from "components/light/directionalLight";
import Tool from "components/tool";
import WorkPiece from "components/workPiece";
import { inject, observer } from "mobx-react";
import { NextRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import mockDataBase from "src/db/rdb_280_1130.json";
import DataModel from "src/model/data.model";
import MockViewModel from "src/viewModel/mockViewModel";
import styled from "styled-components";
import { Vector3 } from "three";

interface IProps {
  mockViewModel: MockViewModel;
  router: NextRouter;
}

function Home({ mockViewModel, router }: IProps) {
  const countRef = useRef(0);
  const [playSpeed, setPlaySpeed] = useState(150);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (mockDataBase[+countRef.current]) {
        mockViewModel.processingData(mockDataBase[countRef?.current]);
        if (countRef.current === null) {
          countRef.current = 0;
        } else {
          countRef.current = countRef.current + 1;
        }
      } else {
        clearInterval(id);
      }
    }, playSpeed);

    setIntervalId(id);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fasterPlay = useCallback(() => {
    clearInterval(intervalId);

    const id = setInterval(
      () => {
        if (mockDataBase[+countRef.current]) {
          mockViewModel.processingData(mockDataBase[countRef?.current]);
          if (countRef.current === null) {
            countRef.current = 0;
          } else {
            countRef.current = countRef.current + 1;
          }
        } else {
          clearInterval(id);
        }
      },
      playSpeed > 101 ? playSpeed - 100 : 1
    );
    setIntervalId(id);
    setPlaySpeed(playSpeed - 100);
  }, []);

  const slowerPlay = useCallback(() => {
    clearInterval(intervalId);

    const id = setInterval(
      () => {
        if (mockDataBase[+countRef.current]) {
          mockViewModel.processingData(mockDataBase[countRef?.current]);
          if (countRef.current === null) {
            countRef.current = 0;
          } else {
            countRef.current = countRef.current + 1;
          }
        } else {
          clearInterval(id);
        }
      },
      playSpeed <= 1900 ? playSpeed + 100 : 1
    );
    setIntervalId(id);
    setPlaySpeed(playSpeed + 100);
  }, []);

  const stop = useCallback(() => {
    clearInterval(intervalId);
    setPlaySpeed(150);
  }, []);

  const go = useCallback(() => {
    clearInterval(intervalId);
    const id = setInterval(() => {
      if (mockDataBase[+countRef.current]) {
        mockViewModel.processingData(mockDataBase[countRef?.current]);
        if (countRef.current === null) {
          countRef.current = 0;
        } else {
          countRef.current = countRef.current + 1;
        }
      } else {
        clearInterval(id);
      }
    }, playSpeed);

    setIntervalId(id);
  }, []);

  useEffect(() => {
    console.log(mockViewModel.renderData, countRef.current);
  }, [mockViewModel.renderData]);

  return (
    <Container>
      <DescriptionWrap>
        <h1>Puma280</h1>
        <p>{`23/11/30\n900131-00021-01-2\nRDB 기준 기록데이터 보정 적용\nRing Geometry\n재생속도 ${playSpeed}ms`}</p>
        <div>
          <button
            onClick={() => {
              mockViewModel.dataReset();
              countRef.current = 0;
              location.replace("/mock/torus");
            }}
          >
            Torus
          </button>
          <button
            onClick={() => {
              mockViewModel.dataReset();
              countRef.current = 0;
              router.reload();
            }}
          >
            Refresh
          </button>
        </div>
        <div>
          <button onClick={slowerPlay}>{`Slower`}</button>
          <button onClick={stop}>{`||`}</button>
          <button onClick={go}>{`>`}</button>
          <button onClick={fasterPlay}>{`Faster`}</button>
        </div>
      </DescriptionWrap>
      <Canvas
        camera={{
          fov: 52,
          near: 0.1,
          far: 2000,
          position: [40, 5, 10],
        }}
      >
        <color attach="background" args={[0.3, 0.3, 0.3]} />

        <CustomDirectionalLight position={new Vector3(60, 40, 60)} />
        <CustomDirectionalLight position={new Vector3(-60, -40, -60)} />

        <Tool data={mockViewModel.renderData} />
        {mockViewModel.dataList.map((data: DataModel, key: number) => {
          if (data.isCutting)
            return <WorkPiece data={data} key={`work_piece_${key}`} />;
        })}
        <OrbitControls target={[0, 0, -10]} />
      </Canvas>
    </Container>
  );
}

export default inject("mockViewModel")(observer(Home));

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  &.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const DescriptionWrap = styled.div`
  position: absolute;
  z-index: 1;
  padding: 16px;
  & * {
    color: #ffffff;
    white-space: pre-wrap;
  }

  & button {
    color: #000000;
    padding: 4px 8px;
    margin: 8px 2px;
  }
`;
