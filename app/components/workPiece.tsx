import DataModel from "src/model/data.model";
import { DoubleSide } from "three";

interface IProps {
  data: DataModel;
}

export default function WorkPiece({ data }: IProps) {
  const color = calculateColor((data.xLoad + data.zLoad) / 2);

  return (
    <mesh position={[0, 0, data.z]} rotation={[Math.PI, Math.PI, 0]}>
      <ringGeometry args={[data.x - 0.1, data.x + 0.1, 96, 12]} />
      <meshPhysicalMaterial color={color} side={DoubleSide} />
    </mesh>
  );
}

// 주어진 부하값에 따라서 RGB 값을 계산하는 함수
const calculateColor = (loadValue: number) => {
  let r, g, b, a;

  if (loadValue <= 15) {
    // 초록색
    const polateValue = Math.floor(interpolate(loadValue, 0, 15, 0, 120));
    r = 0;
    g = 255 - polateValue;
    b = 0;
    a = 255 - polateValue;
  } else if (loadValue <= 50) {
    // 노란색
    const polateValue = Math.floor(interpolate(loadValue, 16, 50, 0, 120));
    r = 255 - polateValue;
    g = 255 - polateValue;
    b = 0;
    a = 255 - polateValue;
  } else {
    // 붉은색
    const polateValue = Math.floor(interpolate(loadValue, 51, 100, 0, 120));
    r = 255 - polateValue;
    g = 0;
    b = 0;
    a = 255 - polateValue;
  }

  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

function interpolate(
  input: number,
  minValue: number,
  maxValue: number,
  outputMinValue: number,
  outputMaxValue: number
): number {
  // 입력값이 주어진 범위를 벗어나면 해당 범위의 최소값 또는 최대값으로 클램핑(clamping)합니다.
  const clampedInput = Math.min(Math.max(input, minValue), maxValue);

  // 입력값이 주어진 범위에서의 비율을 계산합니다.
  const inputRatio = (clampedInput - minValue) / (maxValue - minValue);

  // 출력값의 범위에서 보간된 값을 계산합니다.
  const interpolatedValue =
    outputMinValue + inputRatio * (outputMaxValue - outputMinValue);

  return interpolatedValue;
}
