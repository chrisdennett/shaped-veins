import React, { useState } from "react";
import styled from "styled-components";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import { useLocalStorage } from "../hooks/useLocalStorage";
// ui
import InfoIcon from "@material-ui/icons/InfoRounded";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { styled as mStyled } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
// comps
import { Info } from "../info/Info";
import { Icon } from "@material-ui/core";

export const Controls = ({
  removeLastNode,
  removeLastGroup,
  toggleEditing,
  save_as_svg,
  isEditing,
  setWidth,
  setHeight,
  width,
  height,
  setAnimationIndex,
  animationIndex,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useLocalStorage("showInfo", true);

  useHotkeys("i", () => setShowInfo((prev) => !prev));
  useHotkeys("h", () => setShowControls((prev) => !prev));
  useHotkeys("0", () => setAnimationIndex(0));
  useHotkeys("1", () => setAnimationIndex(1));
  useHotkeys("2", () => setAnimationIndex(2));
  useHotkeys("3", () => setAnimationIndex(3));
  useHotkeys("p", () => toggleEditing());
  useHotkeys("z", () => removeLastNode());
  useHotkeys("x", () => removeLastGroup());
  useHotkeys("s", () => save_as_svg());

  const onShowCheatSheet = () => setShowInfo(true);
  const onInfoClick = () => setShowInfo(false);
  const setIsEditing = () => console.log("toggle Editing");

  const onAnimChange = (e) => {
    setAnimationIndex(parseInt(e.target.value));
  };

  return (
    <>
      {showInfo && <Info onClick={onInfoClick} />}
      <ControlsStyle showControls={showControls}>
        {!showControls && (
          <IconButton onClick={() => setShowControls(true)}>
            <MenuIcon style={{ color: "#555" }} />
          </IconButton>
        )}

        {showControls && (
          <>
            <div style={{ textAlign: "right", padding: 0, margin: 0 }}>
              <IconButton onClick={() => setShowControls(false)}>
                <CloseIcon style={{ color: "white" }} />
              </IconButton>
            </div>
            <Control>
              <Button
                size="small"
                variant="contained"
                startIcon={<InfoIcon />}
                onClick={onShowCheatSheet}
              >
                Info 'i'
              </Button>
            </Control>

            <Control>
              <TextFieldStyled
                label="Width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Control>
            <Control>
              <TextFieldStyled
                label="Height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Control>
            <Control>
              <Button
                size="small"
                variant="contained"
                onClick={toggleEditing}
                style={isEditing ? { background: "green" } : {}}
              >
                {isEditing ? "DONE" : "Edit"} 'e'
              </Button>
            </Control>
            <Control>
              <Button size="small" variant="contained" onClick={removeLastNode}>
                Undo Last Point 'z'
              </Button>
            </Control>
            <Control>
              <Button
                size="small"
                variant="contained"
                onClick={removeLastGroup}
              >
                Delete Last Pyramid 'x'
              </Button>
            </Control>

            <Control>
              <FormControl component="fieldset">
                <FormLabel component="legend">Animation Type</FormLabel>
                <RadioGroup
                  aria-label="animation index"
                  name="animIndex"
                  value={animationIndex}
                  onChange={onAnimChange}
                >
                  <FormControlLabel
                    value={0}
                    control={<Radio />}
                    label="None"
                  />
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="Anim 1"
                  />
                  <FormControlLabel
                    value={2}
                    control={<Radio />}
                    label="Anim 2"
                  />
                  <FormControlLabel
                    value={3}
                    control={<Radio />}
                    label="Anim 3"
                  />
                </RadioGroup>
              </FormControl>
            </Control>

            <Control>
              <Button size="small" variant="contained" onClick={save_as_svg}>
                Save SVG 's'
              </Button>
            </Control>
          </>
        )}
      </ControlsStyle>
    </>
  );
};

const TextFieldStyled = mStyled(TextField)({
  color: "white",
});

const Control = styled.div`
  margin-bottom: 15px;

  button {
    width: 100%;
  }
  /* padding-bottom: 10px; */
  /* border-bottom: 1px solid rgba(255, 255, 255, 0.5); */
`;

const ControlsStyle = styled.div`
  padding: 0 10px;
  border-radius: 0px 0 10px 0;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  color: white;
  width: ${(props) => (props.showControls ? "210px" : "50px")};

  background: rgba(255, 255, 255, 0.2);

  fieldset {
    border-color: white;
    legend {
      color: #aaa !important;
    }
  }

  .MuiTextField-root {
    label {
      color: #aaa;
    }
    input {
      color: white;
    }
  }
`;
