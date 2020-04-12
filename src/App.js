import React, { useState } from "react";
import { saveAs } from "file-saver";
import styled from "styled-components";
import { useLocalStorage } from "./hooks/useLocalStorage";
// comps
import { Pyramid } from "./Pyramid";
import { EditCrossHairs } from "./EditCrosshairs";
import { Controls } from "./controls/Controls";

export default function App() {
  const [animationIndex, setAnimationIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [width, setWidth] = useLocalStorage("width", 1920);
  const [height, setHeight] = useLocalStorage("height", 1080);
  const [currNodes, setCurrNodes] = useState([]);
  const [groups, setGroups] = useLocalStorage("groups", []);
  const [volume, setVolume] = useState({});

  const addNode = (x, y) => {
    if (!isEditing) return;
    const isPeak = currNodes.length === 0;
    const node = { x, y, isPeak };
    if (currNodes.length === 3) {
      setGroups((prevGroups) => [...prevGroups, [...currNodes, node]]);
      setCurrNodes([]);
    } else {
      setCurrNodes((prevArr) => [...prevArr, node]);
    }
  };

  const removeLastNode = () => {
    setCurrNodes((prev) => prev.slice(0, prev.length - 1));
  };

  const removeLastGroup = () => {
    setGroups((prev) => prev.slice(0, prev.length - 1));
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const onVolumeChange = setVolume;

  const controlsProps = {
    removeLastNode,
    removeLastGroup,
    isEditing,
    toggleEditing,
    setWidth,
    setHeight,
    width,
    height,
    setAnimationIndex,
    animationIndex,
    save_as_svg,
    onVolumeChange,
  };

  return (
    <Container>
      <Controls {...controlsProps} />

      <SVG
        isEditing={isEditing}
        width={width > 0 ? width : 1}
        height={height > 0 ? height : 1}
        id="svg"
        xmlns="http://www.w3.org/2000/svg"
        onClick={(e) => addNode(e.clientX, e.clientY)}
      >
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          stroke={"none"}
          fill={"black"}
        />

        {groups.map((group, index) => (
          <g key={"g-" + index}>
            <Pyramid
              volume={volume}
              nodes={group}
              uid={"t" + index}
              isEditing={isEditing}
              animationIndex={animationIndex}
            />
          </g>
        ))}

        <g>
          {currNodes.map((node, index) => (
            <circle
              key={index}
              stroke={node.isPeak ? "red" : "yellow"}
              cx={node.x}
              cy={node.y}
              fill={node.isPeak ? "red" : "yellow"}
              r={6}
            />
          ))}
        </g>

        {isEditing && <EditCrossHairs width={width} height={height} />}
      </SVG>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: white;
  overflow: hidden;
`;

const SVG = styled.svg`
  background: black;
  line-height: 0;
  stroke: white;
  stroke-width: 2px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  cursor: ${(props) => (props.isEditing ? "crosshair" : "inherit")};
`;

// helpers
const save_as_svg = () => {
  var full_svg = get_svg_text();
  var blob = new Blob([full_svg], { type: "image/svg+xml" });
  saveAs(blob, "triangles.svg");
};

// const copy_svg = () => {
//   var full_svg = get_svg_text();
//   copyToClipboard(full_svg);
// };

const get_svg_text = () => {
  var svg_data = document.getElementById("svg")
    ? document.getElementById("svg").outerHTML
    : "waiting"; //put id of your svg element here

  svg_data = svg_data.split(">").join(`>
  `);

  return svg_data;
};

// const copyToClipboard = (str) => {
//   const el = document.createElement("textarea"); // Create a <textarea> element
//   el.value = str; // Set its value to the string that you want copied
//   el.setAttribute("readonly", ""); // Make it readonly to be tamper-proof
//   el.style.position = "absolute";
//   el.style.left = "-9999px"; // Move outside the screen to make it invisible
//   document.body.appendChild(el); // Append the <textarea> element to the HTML document
//   const selected =
//     document.getSelection().rangeCount > 0 // Check if there is any content selected previously
//       ? document.getSelection().getRangeAt(0) // Store selection if found
//       : false; // Mark as false to know no selection existed before
//   el.select(); // Select the <textarea> content
//   document.execCommand("copy"); // Copy - only works as a result of a user action (e.g. click events)
//   document.body.removeChild(el); // Remove the <textarea> element
//   if (selected) {
//     // If a selection existed before copying
//     document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
//     document.getSelection().addRange(selected); // Restore the original selection
//   }
// };
