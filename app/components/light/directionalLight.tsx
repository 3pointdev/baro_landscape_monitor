import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import { DirectionalLightHelper, Vector3 } from "three";

interface IProps {
  isHelper?: boolean;
  position: Vector3 | undefined;
}

export default function CustomDirectionalLight({
  isHelper = false,
  position,
}: IProps) {
  const lightRef = useRef<any>();

  useHelper(lightRef, DirectionalLightHelper);

  if (isHelper) {
    return (
      <directionalLight ref={lightRef} position={position} intensity={1} />
    );
  } else {
    return <directionalLight position={position} intensity={1} />;
  }
}
