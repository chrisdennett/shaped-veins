import React, { useState } from "react";
import { saveAs } from "file-saver";
import styled from "styled-components";

export default function App() {
  const [currNodes, setCurrNodes] = useState([]);
  const [groups, setGroups] = useState([]);

  const addNode = (x, y) => {
    const isPeak = currNodes.length === 0;
    const node = { x, y, isPeak };
    if (currNodes.length === 3) {
      setGroups((prevGroups) => [...prevGroups, [...currNodes, node]]);
      setCurrNodes([]);
    } else {
      setCurrNodes((prevArr) => [...prevArr, node]);
    }
  };

  const removeLastGroup = () => {
    setGroups((prevGroups) => prevGroups.slice(0, prevGroups.length - 1));
  };

  return (
    <Container>
      <ButtonGroup>
        <button onClick={save_as_svg}>SAVE</button>
        <button onClick={removeLastGroup}>REMOVE LAST ONE</button>
      </ButtonGroup>
      <SVG
        id="svg"
        xmlns="http://www.w3.org/2000/svg"
        onClick={(e) => addNode(e.clientX, e.clientY)}
      >
        <g>
          {currNodes.map((node, index) => (
            <circle
              key={index}
              stroke={node.isPeak ? "red" : "yellow"}
              cx={node.x}
              cy={node.y}
              r={3}
            />
          ))}
        </g>

        {<TriangleGroups groups={groups} />}
      </SVG>
    </Container>
  );
}

const TriangleGroups = ({ groups, inEditMode }) => {
  return groups.map((group, index) => {
    return (
      <g key={"g-" + index}>
        <Triangles nodes={group} uid={"t" + index} />
      </g>
    );
  });
};

const Triangles = ({ nodes, uid }) => {
  const peakNode = nodes.filter((node) => node.isPeak)[0];
  const edgeNodes = nodes.filter((node) => !node.isPeak);
  const trianglePaths = [];

  const { x: x0, y: y0 } = peakNode;

  for (let i = 0; i < edgeNodes.length; i++) {
    const { x: x1, y: y1 } = edgeNodes[i];
    const isLastNode = i === edgeNodes.length - 1;
    const nextNode = isLastNode ? edgeNodes[0] : edgeNodes[i + 1];
    const { x: x2, y: y2 } = nextNode;

    trianglePaths.push(`M ${x0},${y0} L ${x1}, ${y1} L ${x2}, ${y2} Z`);
  }

  return trianglePaths.map((path, index) => (
    <path key={uid + "" + index} fill={"none"} stroke={"white"} d={path} />
  ));
};

const ButtonGroup = styled.div`
  position: absolute;
  button {
    margin-right: 10px;
    border: none;
    background: yellow;
    font-weight: bold;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  border: red;
  background: red;
  overflow: hidden;
`;

const SVG = styled.svg`
  background: black;
  width: 100%;
  height: 100%;
  line-height: 0;
  stroke: white;
  stroke-width: 2px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

// helpers
const save_as_svg = () => {
  var full_svg = get_svg_text();
  var blob = new Blob([full_svg], { type: "image/svg+xml" });
  saveAs(blob, "triangles.svg");
};

const get_svg_text = () => {
  var svg_data = document.getElementById("svg")
    ? document.getElementById("svg").outerHTML
    : "waiting"; //put id of your svg element here

  svg_data = svg_data.split(">").join(`>
  `);

  return svg_data;
};
