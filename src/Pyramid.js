import React, { useState } from "react";

import { Triangle } from "./Triangle";

export const Pyramid = ({
  nodes,
  isEditing,
  animationIndex,
  setAnimationIndex,
  volume,
}) => {
  const [hue] = useState(Math.round(Math.random() * 360));

  const peakNode = nodes.filter((node) => node.isPeak)[0];
  const edgeNodes = nodes.filter((node) => !node.isPeak);

  const triangles = [
    <Triangle
      key={"tri-1"}
      index={0}
      hue={hue}
      volume={volume}
      points={[peakNode, edgeNodes[0], edgeNodes[1]]}
      animationIndex={animationIndex}
      setAnimationIndex={setAnimationIndex}
      isEditing={isEditing}
    />,
    <Triangle
      key={"tri-2"}
      index={1}
      hue={hue}
      volume={volume}
      points={[peakNode, edgeNodes[1], edgeNodes[2]]}
      animationIndex={animationIndex}
      setAnimationIndex={setAnimationIndex}
      isEditing={isEditing}
    />,
    <Triangle
      key={"tri-3"}
      index={2}
      hue={hue}
      volume={volume}
      points={[peakNode, edgeNodes[2], edgeNodes[0]]}
      animationIndex={animationIndex}
      setAnimationIndex={setAnimationIndex}
      isEditing={isEditing}
    />,
  ];

  return triangles;
};
