import React from "react";
import { useMousePosition } from "../hooks/useMousePosition";

export const EditCrossHairs = ({ width, height }) => {
  const { x, y } = useMousePosition();

  return (
    <g>
      <line x1={x} y1={0} x2={x} y2={height} stroke={"red"} />
      <line x1={0} y1={y} x2={width} y2={y} stroke={"red"} />
      <circle
        cx={x}
        cy={y}
        fill={"none"}
        stroke={"red"}
        strokeWidth={3}
        r={12}
      />
    </g>
  );
};
