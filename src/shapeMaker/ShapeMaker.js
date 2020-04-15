import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { EditCrossHairs } from "./EditCrosshairs";

const ShapeMaker = ({
  width,
  height,
  bounds = [],
  startPoints = [],
  obstacles = [],
  setBounds,
  setStartPoints,
  setObstacles,
  isAddingBounds,
  isAddingStartPoints,
  isAddingObstacles,
}) => {
  const [indexToEdit, setIndexToEdit] = useState(null);

  useEffect(() => {
    if (indexToEdit === null) return;

    const setFromEvent = (e) => {
      updateMarkerPosition(indexToEdit, e.clientX, e.clientY);
    };
    window.addEventListener("mousemove", setFromEvent);
    return () => {
      window.removeEventListener("mousemove", setFromEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexToEdit]);

  const addNode = (x, y) => {
    const node = [x, y];
    if (isAddingBounds) {
      setBounds([...bounds, node]);
    } else if (isAddingStartPoints) {
      setStartPoints([...startPoints, node]);
    } else if (isAddingObstacles) {
      setObstacles([...obstacles, node]);
    }
  };

  const updateMarkerPosition = (indexToEdit, x, y) => {
    if (indexToEdit.isBoundsPt) {
      const newArr = [...bounds];
      newArr[indexToEdit.index] = [x, y];
      setBounds(newArr);
    } else if (indexToEdit.isStartPt) {
      const newArr = [...startPoints];
      newArr[indexToEdit.index] = [x, y];
      setStartPoints(newArr);
    } else if (indexToEdit.isObstaclePt) {
      const newArr = [...obstacles];
      newArr[indexToEdit.index] = [x, y];
      setObstacles(newArr);
    }
  };

  const isAddingNodes =
    isAddingBounds || isAddingStartPoints || isAddingObstacles;

  let crosshairColour = "red";
  if (isAddingStartPoints) crosshairColour = "yellow";
  if (isAddingBounds) crosshairColour = "blue";

  return (
    <SVG
      width={width > 0 ? width : 1}
      height={height > 0 ? height : 1}
      id="svg"
      xmlns="http://www.w3.org/2000/svg"
      isAddingNodes={isAddingBounds}
      onMouseUp={() => setIndexToEdit(null)}
      onClick={(e) => addNode(e.clientX, e.clientY)}
    >
      <g>
        {bounds.map((node, index) => {
          const isLastNode = index === bounds.length - 1;
          const isFirstNode = index === 0;
          const nextNode = bounds[isLastNode ? 0 : index + 1];
          const nodeColour = "blue";
          const lastNode = bounds[bounds.length - 1];

          return (
            <g key={index}>
              {isFirstNode && (
                <line
                  x1={lastNode[0]}
                  y1={lastNode[1]}
                  x2={node[0]}
                  y2={node[1]}
                  stroke={"red"}
                />
              )}

              {!isLastNode && (
                <line
                  x1={node[0]}
                  y1={node[1]}
                  x2={nextNode[0]}
                  y2={nextNode[1]}
                  stroke={"red"}
                />
              )}
              <StyledCircle
                onMouseDown={() => setIndexToEdit({ index, isBoundsPt: true })}
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

      <g>
        {obstacles.map((node, index) => {
          const isLastNode = index === obstacles.length - 1;
          const isFirstNode = index === 0;
          const nextNode = obstacles[isLastNode ? 0 : index + 1];
          const nodeColour = "red";
          const lastNode = obstacles[obstacles.length - 1];

          return (
            <g key={index}>
              {isFirstNode && (
                <line
                  x1={lastNode[0]}
                  y1={lastNode[1]}
                  x2={node[0]}
                  y2={node[1]}
                  stroke={"red"}
                />
              )}

              {!isLastNode && (
                <line
                  x1={node[0]}
                  y1={node[1]}
                  x2={nextNode[0]}
                  y2={nextNode[1]}
                  stroke={"red"}
                />
              )}
              <StyledCircle
                onMouseDown={() =>
                  setIndexToEdit({ index, isObstaclePt: true })
                }
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

      <g>
        {startPoints.map((node, index) => {
          return (
            <g key={"startPt" + index}>
              <StyledCircle
                onMouseDown={() => setIndexToEdit({ index, isStartPt: true })}
                stroke={"yellow"}
                cx={node[0]}
                cy={node[1]}
                fill={"yellow"}
                r={10}
              />
            </g>
          );
        })}
      </g>
      {isAddingNodes && (
        <EditCrossHairs
          width={width}
          height={height}
          crosshairColour={crosshairColour}
        />
      )}
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
