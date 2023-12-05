import DataModel from "src/model/data.model";

interface IProps {
  data: DataModel;
}

export default function Tool({ data }: IProps) {
  return (
    <mesh
      position={[data.x, 0, data.z + 0.28]}
      rotation={[0, -Math.PI / 2, Math.PI / 2]}
    >
      <coneGeometry args={[0.3, 0.6, 24]} />
      <meshBasicMaterial color={0xffffffff} />
    </mesh>
  );
}
