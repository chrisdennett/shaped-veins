import React from "react";

import { useAnimationFrame } from "./hooks/useAnimationFrame";

export const Pyramid = ({ nodes, uid, isAnimating }) => {
  const [hue, setHue] = React.useState(Math.round(Math.random() * 360));

  const peakNode = nodes.filter((node) => node.isPeak)[0];
  const edgeNodes = nodes.filter((node) => !node.isPeak);

  const trianglePaths = [];

  useAnimationFrame((deltaTime) => {
    // Pass on a function to the setter of the state
    // to make sure we always have the latest state
    setHue((prevHue) => (prevHue + deltaTime * 0.01) % 360);
  });

  const { x: x0, y: y0 } = peakNode;

  for (let i = 0; i < edgeNodes.length; i++) {
    const { x: x1, y: y1 } = edgeNodes[i];
    const isLastNode = i === edgeNodes.length - 1;
    const nextNode = isLastNode ? edgeNodes[0] : edgeNodes[i + 1];
    const { x: x2, y: y2 } = nextNode;

    trianglePaths.push(`M ${x0},${y0} L ${x1}, ${y1} L ${x2}, ${y2} Z`);
  }

  return trianglePaths.map((path, index) => (
    <path
      key={uid + "" + index}
      fill={isAnimating ? `hsl(${hue}, 100%, ${index * 15 + 50}%)` : "none"}
      stroke={isAnimating ? "black" : "white"}
      strokeWidth={4}
      d={path}
    />
  ));
};
