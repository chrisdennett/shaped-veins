import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { EditCrossHairs } from "./EditCrosshairs";

const ShapeMaker = ({
  width,
  height,
  bounds = [],
  updateBounds,
  isEditing,
  isDrawingOuterShape,
}) => {
  const [indexToEdit, setIndexToEdit] = useState(null);

  useEffect(() => {
    if (indexToEdit === null) return;

    const setFromEvent = (e) =>
      updateMarkerPosition(indexToEdit, e.clientX, e.clientY);

    window.addEventListener("mousemove", setFromEvent);
    return () => {
      window.removeEventListener("mousemove", setFromEvent);
    };
  }, [indexToEdit]);

  const addNode = (x, y) => {
    if (!isDrawingOuterShape) return;
    const node = [x, y];
    updateBounds([...bounds, node]);
  };

  const updateMarkerPosition = (index, x, y) => {
    const newArr = [...bounds];
    newArr[index] = [x, y];
    updateBounds(newArr);
  };

  return (
    <SVG
      width={width > 0 ? width : 1}
      height={height > 0 ? height : 1}
      id="svg"
      xmlns="http://www.w3.org/2000/svg"
      isAddingNodes={isDrawingOuterShape}
      onMouseUp={() => setIndexToEdit(null)}
      onClick={(e) => addNode(e.clientX, e.clientY)}
    >
      <g>
        {bounds.map((node, index) => {
          const isLastNode = index === bounds.length - 1;
          const isFirstNode = index === 0;
          const nextNode = bounds[isLastNode ? 0 : index + 1];
          let nodeColour = "blue";
          if (isFirstNode) nodeColour = "green";
          if (isLastNode) nodeColour = "red";

          return (
            <g key={index}>
              <line
                x1={node[0]}
                y1={node[1]}
                x2={nextNode[0]}
                y2={nextNode[1]}
                stroke={"red"}
              />
              <StyledCircle
                onMouseDown={() => setIndexToEdit(index)}
                stroke={nodeColour}
                cx={node[0]}
                cy={node[1]}
                fill={nodeColour}
                r={10}
              />
            </g>
          );
        })}
      </g>
      {isDrawingOuterShape && <EditCrossHairs width={width} height={height} />}
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
  cursor: ${(props) => (props.isAddingNodes ? "crosshair" : "inherit")};
`;

const StyledCircle = styled.circle`
  cursor: pointer;
`;
