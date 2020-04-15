import React from "react";
import { useMousePosition } from "../hooks/useMousePosition";

export const EditCrossHairs = ({ width, height, crosshairColour }) => {
  const { x, y } = useMousePosition();

  return (
    <g>
      <line x1={x} y1={0} x2={x} y2={height} stroke={crosshairColour} />
      <line x1={0} y1={y} x2={width} y2={y} stroke={crosshairColour} />
      <circle
        cx={x}
        cy={y}
        fill={crosshairColour}
        stroke={crosshairColour}
        strokeWidth={3}
        r={12}
      />
    </g>
  );
};
