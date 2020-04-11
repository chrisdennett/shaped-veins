import React, { useState } from "react";
import styled from "styled-components";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import { useLocalStorage } from "../hooks/useLocalStorage";
// ui
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
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
  useHotkeys("1", () => setAnimationIndex(1));
  useHotkeys("2", () => setAnimationIndex(1));
  useHotkeys("p", () => setIsEditing((prev) => !prev));
  useHotkeys("z", () => removeLastNode());
  useHotkeys("x", () => removeLastGroup());
  useHotkeys("s", () => save_as_svg());

  const onShowCheatSheet = () => setShowInfo(true);
  const onInfoClick = () => setShowInfo(false);
  const setShowControls = () => console.log("toggle controls");
  const setIsEditing = () => console.log("toggle Editing");

  const onAnimChange = (e) => {
    setAnimationIndex(parseInt(e.target.value));
  };

  const onDoAnimateChange = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
    }

    setDoAnimate(isChecked);
  };

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
        {/* <FormControlLabel
          control={
            <Switch
              checked={doAnimate}
              onChange={onDoAnimateChange}
              name="checkedA"
            />
          }
          label="Animate"
        /> */}
        <StyledFormControl component="fieldset">
          <FormLabel component="legend">Animation Type</FormLabel>
          <RadioGroup
            aria-label="animation index"
            name="animIndex"
            value={animationIndex}
            onChange={onAnimChange}
          >
            <FormControlLabel value={0} control={<Radio />} label="None" />
            <FormControlLabel value={1} control={<Radio />} label="Anim 1" />
            <FormControlLabel value={2} control={<Radio />} label="Anim 2" />
            <FormControlLabel value={3} control={<Radio />} label="Anim 3" />
          </RadioGroup>
        </StyledFormControl>
        <button onClick={save_as_svg}>Save SVG 's'</button>
      </ControlsStyle>
    </>
  );
};

const ControlsStyle = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.2);

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

const StyledFormControl = styled(FormControl)`
  margin-top: 10px;
  legend {
    color: rgba(255, 255, 255, 0.7);
  }
`;
