import React, { useState } from "react";

import { useAnimationFrame } from "./hooks/useAnimationFrame";
import { Triangle } from "./Triangle";

export const Pyramid = ({ nodes, uid, isAnimating, isEditing }) => {
  const [hue, setHue] = useState(Math.round(Math.random() * 360));
  const [frameDecimal, setFrameDecimal] = useState(0);

  const peakNode = nodes.filter((node) => node.isPeak)[0];
  const edgeNodes = nodes.filter((node) => !node.isPeak);

  useAnimationFrame((deltaTime) => {
    // Pass on a function to the setter of the state
    // to make sure we always have the latest state
    setHue((prevHue) => (prevHue + deltaTime * 0.08) % 360);
    setFrameDecimal((prevDec) => (prevDec >= 1 ? 0 : prevDec + 0.01));
  });

  const triangles = [
    <Triangle
      key={"tri-1"}
      index={0}
      hue={hue}
      frameDecimal={frameDecimal}
      points={[peakNode, edgeNodes[0], edgeNodes[1]]}
      isAnimating={isAnimating}
      isEditing={isEditing}
    />,
    <Triangle
      key={"tri-2"}
      index={1}
      hue={hue}
      frameDecimal={frameDecimal}
      points={[peakNode, edgeNodes[1], edgeNodes[2]]}
      isAnimating={isAnimating}
      isEditing={isEditing}
    />,
    <Triangle
      key={"tri-3"}
      index={2}
      hue={hue}
      frameDecimal={frameDecimal}
      points={[peakNode, edgeNodes[2], edgeNodes[0]]}
      isAnimating={isAnimating}
      isEditing={isEditing}
    />,
  ];

  return triangles;

  //   return trianglePaths.map((path, index) => (
  //     <g key={uid + "-" + index}>
  //       <line
  //         x1={lineX1}
  //         y1={lineY1}
  //         x2={lineX2}
  //         y2={lineY2}
  //         stroke={"white"}
  //         strokeWidth={5}
  //       />

  //       <path
  //         fill={
  //           isAnimating
  //             ? `hsl(${hue}, ${100 - index * 20}%, ${12 + 20 * index}%)`
  //             : "none"
  //         }
  //         stroke={isAnimating && !isEditing ? "black" : "white"}
  //         strokeWidth={4}
  //         d={path}
  //       />
  //     </g>
  //   ));
};
