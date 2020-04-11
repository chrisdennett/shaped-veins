import React, { useState } from "react";
import styled from "styled-components";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import { useLocalStorage } from "../hooks/useLocalStorage";
// ui
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import { Info } from "../info/Info";

export const Controls = ({
  removeLastNode,
  removeLastGroup,
  toggleEditing,
  save_as_svg,
  setWidth,
  setHeight,
  width,
  height,
  setAnimationIndex,
  animationIndex,
}) => {
  const [doAnimate, setDoAnimate] = useState(true);
  const [showInfo, setShowInfo] = useLocalStorage("showInfo", true);

  useHotkeys("i", () => setShowInfo((prev) => !prev));
  useHotkeys("h", () => setShowControls((prev) => !prev));
  useHotkeys("a", () => setIsAnimating((prev) => !prev));
  useHotkeys("2", () => setIsAnimating2((prev) => !prev));
  useHotkeys("p", () => setIsEditing((prev) => !prev));
  useHotkeys("z", () => removeLastNode());
  useHotkeys("x", () => removeLastGroup());
  useHotkeys("s", () => save_as_svg());

  const onShowCheatSheet = () => setShowInfo(true);
  const onInfoClick = () => setShowInfo(false);
  const setShowControls = () => console.log("toggle controls");
  const setIsAnimating = () => console.log("toggle animate");
  const setIsAnimating2 = () => console.log("toggle animate 2");
  const setIsEditing = () => console.log("toggle Editing");

  const onDoAnimateChange = (e) => setDoAnimate(e.target.checked);

  return (
    <>
      {showInfo && <Info onClick={onInfoClick} />}
      <ControlsStyle>
        <button onClick={onShowCheatSheet}>Info 'i'</button>
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
        <button onClick={toggleEditing}>Add Pyramid 'p'</button>
        <button onClick={removeLastNode}>Undo Last Point 'z'</button>
        <button onClick={removeLastGroup}>Delete Last Pyramid 'x'</button>
        <FormControlLabel
          control={
            <Switch
              checked={doAnimate}
              onChange={onDoAnimateChange}
              name="checkedA"
            />
          }
          label="Animate"
        />
        <button onClick={save_as_svg}>Save SVG 's'</button>
      </ControlsStyle>
    </>
  );
};

const ControlsStyle = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  background: none;

  a {
    color: white;
  }

  button {
    margin-right: 10px;
    text-align: left;
    border: none;
    background: yellow;
    font-weight: bold;
    padding: 3px 0;
    margin: 3px 0;
    cursor: pointer;
  }
  label {
    color: white;
    margin: 5px 0;
  }
  input {
    width: 50px;
    margin-right: 10px;
    padding: 5px;
  }
`;
