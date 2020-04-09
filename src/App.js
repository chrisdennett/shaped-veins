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
        <button onClick={save_as_svg}>SAVE SVG</button>
        <button onClick={copy_svg}>COPY SVG</button>
        <button onClick={removeLastGroup}>REMOVE LAST</button>
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

const copy_svg = () => {
  var full_svg = get_svg_text();
  copyToClipboard(full_svg);
};

const get_svg_text = () => {
  var svg_data = document.getElementById("svg")
    ? document.getElementById("svg").outerHTML
    : "waiting"; //put id of your svg element here

  svg_data = svg_data.split(">").join(`>
  `);

  return svg_data;
};

const copyToClipboard = (str) => {
  const el = document.createElement("textarea"); // Create a <textarea> element
  el.value = str; // Set its value to the string that you want copied
  el.setAttribute("readonly", ""); // Make it readonly to be tamper-proof
  el.style.position = "absolute";
  el.style.left = "-9999px"; // Move outside the screen to make it invisible
  document.body.appendChild(el); // Append the <textarea> element to the HTML document
  const selected =
    document.getSelection().rangeCount > 0 // Check if there is any content selected previously
      ? document.getSelection().getRangeAt(0) // Store selection if found
      : false; // Mark as false to know no selection existed before
  el.select(); // Select the <textarea> content
  document.execCommand("copy"); // Copy - only works as a result of a user action (e.g. click events)
  document.body.removeChild(el); // Remove the <textarea> element
  if (selected) {
    // If a selection existed before copying
    document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
    document.getSelection().addRange(selected); // Restore the original selection
  }
};
