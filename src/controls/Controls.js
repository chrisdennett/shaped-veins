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
import Microphone from "../microphone/Microphone";

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
  onVolumeChange,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useLocalStorage("showInfo", true);
  const [minVolume, setMinVolume] = useLocalStorage("minVolume", 0.1);
  const [maxVolume, setMaxVolume] = useLocalStorage("maxVolume", 0.7);

  useHotkeys("i", () => setShowInfo((prev) => !prev));
  useHotkeys("h", () => setShowControls((prev) => !prev));
  useHotkeys("n", () => setAnimationIndex(0));
  useHotkeys("a", () => setAnimationIndex(1));
  useHotkeys("b", () => setAnimationIndex(2));
  useHotkeys("c", () => setAnimationIndex(3));
  useHotkeys("d", () => setAnimationIndex(4));
  useHotkeys("e", () => toggleEditing());
  useHotkeys("z", () => removeLastNode());
  useHotkeys("x", () => removeLastGroup());
  useHotkeys("s", () => save_as_svg());

  const onShowCheatSheet = () => setShowInfo(true);
  const onInfoClick = () => setShowInfo(false);

  const onAnimChange = (e) => {
    const newAnimIndex = e.target.value;

    if (newAnimIndex === 4) {
    }

    setAnimationIndex(parseInt(newAnimIndex));
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
            <Microphone
              onVolumeChange={(vol) =>
                onVolumeChange({
                  vol,
                  minVolume: parseFloat(minVolume),
                  maxVolume: parseFloat(maxVolume),
                })
              }
              getMic={animationIndex === 4}
            />

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
                    label="Anim A"
                  />
                  <FormControlLabel
                    value={2}
                    control={<Radio />}
                    label="Anim B"
                  />
                  <FormControlLabel
                    value={3}
                    control={<Radio />}
                    label="Anim C"
                  />
                  <FormControlLabel
                    value={4}
                    control={<Radio />}
                    label="Wall Shouter"
                  />
                </RadioGroup>
              </FormControl>
            </Control>

            {animationIndex === 4 && (
              <>
                <Control>
                  <TextFieldStyled
                    label="Min Volume"
                    value={minVolume}
                    onChange={(e) => setMinVolume(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Control>
                <Control>
                  <TextFieldStyled
                    label="Max Volume"
                    type={"number"}
                    min={0}
                    max={1}
                    value={maxVolume}
                    onChange={(e) => setMaxVolume(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Control>
              </>
            )}

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
  background: rgba(0, 0, 0, 0.8);

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
