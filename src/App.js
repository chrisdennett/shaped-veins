import React, { useState } from "react";
import { saveAs } from "file-saver";
import styled from "styled-components";
import { useLocalStorage } from "./hooks/useLocalStorage";
// comps
import { Controls } from "./controls/Controls";
import Display from "./display/Display";
import ShapeMaker from "./shapeMaker/ShapeMaker";

export default function App() {
  const [reRunId, setReRunId] = useState(0);
  const [isDrawingOuterShape, setIsDrawingOuterShape] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [bounds, setBounds] = useLocalStorage("bounds", []);
  const [startPoints, setStartPoints] = useLocalStorage("startPoints", []);

  const width = window.innerWidth;
  const height = window.innerHeight;

  const updateBounds = (newBounds) => {
    setBounds(newBounds);
  };

  const updateStartPoints = (newStartPoints) => {
    setStartPoints(newStartPoints);
  };

  const removeLastNode = () => {
    setBounds((prev) => [...prev].slice(0, prev.length - 1));
  };

  const drawOuterShape = (doDraw) => {
    if (doDraw) {
      setBounds([]);
      setIsDrawingOuterShape(true);
    } else {
      setIsDrawingOuterShape(false);
    }
  };

  const reRun = () => setReRunId((prev) => setReRunId(prev + 1));

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const controlsProps = {
    isEditing,
    isDrawingOuterShape,
    removeLastNode,
    drawOuterShape,
    toggleEditing,
    save_as_svg,
    reRun,
  };

  const showShapeMaker = isEditing || isDrawingOuterShape;

  return (
    <Container>
      <Controls {...controlsProps} />
      {showShapeMaker && (
        <ShapeMaker
          width={width}
          height={height}
          bounds={bounds}
          isDrawingOuterShape={isDrawingOuterShape}
          isEditing={isEditing}
          updateBounds={updateBounds}
          updateStartPoints={updateStartPoints}
          startPoints={startPoints}
        />
      )}
      <Display
        width={width}
        height={height}
        bounds={bounds}
        startPoints={startPoints}
        reRunId={reRunId}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: white;
  overflow: hidden;
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
