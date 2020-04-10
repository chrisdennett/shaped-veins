import React, { useState } from "react";
// import { useHotkeys } from "react-hotkeys-hook";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import { saveAs } from "file-saver";
import styled from "styled-components";
import { useLocalStorage } from "./hooks/useLocalStorage";
// comps
import { Pyramid } from "./Pyramid";
import { EditCrossHairs } from "./EditCrosshairs";
import Cheatsheet from "./hooks/cheatsheet";

export default function App() {
  const [isAnimating, setIsAnimating] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showCheatsheet, setShowCheapsheet] = useLocalStorage(
    "showCheatsheet",
    true
  );
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [currNodes, setCurrNodes] = useState([]);
  const [groups, setGroups] = useLocalStorage("groups", []);

  useHotkeys("c", () => setShowCheapsheet((prev) => !prev));
  useHotkeys("h", () => setShowControls((prev) => !prev));
  useHotkeys("a", () => setIsAnimating((prev) => !prev));
  useHotkeys("e", () => setIsEditing((prev) => !prev));
  useHotkeys("z", () => removeLastNode());
  useHotkeys("x", () => removeLastGroup());
  useHotkeys("s", () => save_as_svg());

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

  const onCheatsheetClick = () => setShowCheapsheet(false);
  const onShowCheatSheet = () => setShowCheapsheet(true);
  const toggleEditing = () => setIsEditing((prev) => !prev);

  return (
    <Container>
      {showControls && (
        <Controls>
          <button onClick={save_as_svg}>Save SVG - s</button>
          {/* <button onClick={copy_svg}>COPY SVG</button> */}
          <button onClick={removeLastGroup}>Delete Last Pyramid - x</button>
          <button onClick={removeLastNode}>Undo Last Point - z</button>
          <button onClick={onShowCheatSheet}>Cheatsheet - c</button>
          <button onClick={toggleEditing}>Toggle Editing - e</button>
          <label>
            width:
            <input
              onChange={(e) => setWidth(e.target.value)}
              maxLength="4"
              size="4"
              type="number"
              value={width}
            />
          </label>
          <label>
            height:
            <input
              onChange={(e) => setHeight(e.target.value)}
              maxLength="4"
              size="4"
              type="number"
              value={height}
            />
          </label>
        </Controls>
      )}

      {showCheatsheet && <Cheatsheet onClick={onCheatsheetClick} />}

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
              nodes={group}
              uid={"t" + index}
              isEditing={isEditing}
              isAnimating={isAnimating}
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

const Controls = styled.div`
  position: absolute;
  button {
    margin-right: 10px;
    border: none;
    background: yellow;
    font-weight: bold;
  }
  label {
    color: white;
  }
  input {
    width: 60px;
    margin-right: 10px;
  }
`;

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
