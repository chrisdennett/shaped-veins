import React from "react";

export const Triangle = ({
  points,
  index,
  hue,
  frameDecimal,
  isAnimating,
  isEditing,
}) => {
  const peakNode = points[0];

  const lineStart = {
    x1: points[1].x,
    y1: points[1].y,
    x2: points[2].x,
    y2: points[2].y,
    tartX: peakNode.x,
    tartY: peakNode.y,
  };

  const incX1 = peakNode.x - lineStart.x1;
  const incX2 = peakNode.x - lineStart.x2;
  const incY1 = peakNode.y - lineStart.y1;
  const incY2 = peakNode.y - lineStart.y2;

  const lineX1 = lineStart.x1 + frameDecimal * incX1;
  const lineX2 = lineStart.x2 + frameDecimal * incX2;
  const lineY1 = lineStart.y1 + frameDecimal * incY1;
  const lineY2 = lineStart.y2 + frameDecimal * incY2;

  return (
    <g>
      <path
        fill={
          isAnimating
            ? `hsl(${hue}, ${100 - index * 20}%, ${12 + 20 * index}%)`
            : "none"
        }
        stroke={isAnimating && !isEditing ? "black" : "white"}
        strokeWidth={4}
        d={`M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y} L ${points[2].x},${points[2].y} Z`}
      />

      <line
        x1={lineX1}
        y1={lineY1}
        x2={lineX2}
        y2={lineY2}
        stroke={"white"}
        strokeWidth={5}
      />
    </g>
  );
};
