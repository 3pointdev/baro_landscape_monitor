import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import CustomDirectionalLight from "components/light/directionalLight";
import Tool from "components/tool";
import WorkPiece from "components/workPiece";
import { inject, observer } from "mobx-react";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";
import DataModel from "src/model/data.model";
import ViewModel from "src/viewModel/viewModel";
import styled from "styled-components";
import { Vector3 } from "three";

interface IProps {
  viewModel: ViewModel;
  router: NextRouter;
}

function Home({ viewModel }: IProps) {
  const target = ["Puma280", "PumaV400", "Lynx220", "Lynx220LSY", "Lynx220LC"];
  const [active, setActive] = useState(target[0]);

  useEffect(() => {
    viewModel.insertMachineList(active);

    return () => {
      viewModel.socketDisconnect();
    };
  }, []);

  if (viewModel.machineReady) {
    return (
      <Container>
        <Canvas
          camera={{
            fov: 60,
            near: 0.1,
            far: 2000,
            position: [25, 20, 14],
          }}
        >
          <color attach="background" args={[0, 0, 0]} />

          <CustomDirectionalLight position={new Vector3(60, 40, 60)} />
          <CustomDirectionalLight position={new Vector3(-60, -40, -60)} />

          <Tool data={viewModel.renderData} />
          {viewModel.dataList.map((data: DataModel, key: number) => {
            if (data.isCutting)
              return <WorkPiece data={data} key={`work_piece_${key}`} />;
          })}

          <OrbitControls />
          <axesHelper />
          <gridHelper args={[50, 50]} />
        </Canvas>
      </Container>
    );
  } else {
    return (
      <Container className="loading">
        <p>기계 데이터를 3D로 변환하는 중...</p>
        <p>대상 : {active}</p>
      </Container>
    );
  }
}

export default inject("viewModel")(observer(Home));

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
