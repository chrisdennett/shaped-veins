import React from "react";
import styled from "styled-components";
import { EditCrossHairs } from "./EditCrosshairs";

const ShapeMaker = ({ width, height, bounds = [], updateBounds }) => {
  const addNode = (x, y) => {
    const node = [x, y];
    updateBounds([...bounds, node]);
  };

  return (
    <SVG
      width={width > 0 ? width : 1}
      height={height > 0 ? height : 1}
      id="svg"
      xmlns="http://www.w3.org/2000/svg"
      onClick={(e) => addNode(e.clientX, e.clientY)}
    >
      <g>
        {bounds.map((node, index) => (
          <circle
            key={index}
            stroke={index === 0 ? "green" : "blue"}
            cx={node[0]}
            cy={node[1]}
            fill={index === 0 ? "green" : "blue"}
            r={6}
          />
        ))}
      </g>

      <EditCrossHairs width={width} height={height} />
    </SVG>
  );
};

export default ShapeMaker;

const SVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0);
  line-height: 0;
  stroke: white;
  stroke-width: 2px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  cursor: crosshair;
`;
