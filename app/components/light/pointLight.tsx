import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import { PointLightHelper, Vector3 } from "three";

interface IProps {
  isHelper?: boolean;
  position: Vector3 | undefined;
}

export default function CustomPointLight({
  isHelper = false,
  position,
}: IProps) {
  const lightRef = useRef<any>();

  useHelper(lightRef, PointLightHelper);

  if (isHelper) {
    return <pointLight ref={lightRef} position={position} intensity={0.8} />;
  } else {
    return <pointLight position={position} intensity={0.8} />;
  }
}
