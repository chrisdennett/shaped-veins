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

export const Controls = ({
  clearBounds,
  removeLastNode,
  toggleEditing,
  save_as_svg,
  isEditing,
}) => {
  const [showControls, setShowControls] = useState(false);
  const [showInfo, setShowInfo] = useLocalStorage("showInfo", true);

  useHotkeys("i", () => setShowInfo((prev) => !prev));
  useHotkeys("h", () => setShowControls((prev) => !prev));
  useHotkeys("e", () => toggleEditing());
  useHotkeys("z", () => removeLastNode());
  useHotkeys("x", () => clearBounds());
  useHotkeys("s", () => save_as_svg());

  const onShowCheatSheet = () => setShowInfo(true);
  const onInfoClick = () => setShowInfo(false);

  return (
    <>
      {showInfo && <Info onClick={onInfoClick} />}
      <ControlsStyle showControls={showControls} isOpen={showControls}>
        {!showControls && (
          <IconButton
            onClick={() => setShowControls(true)}
            style={{ width: 30, height: 30, padding: 0 }}
          >
            <MenuIcon style={{ color: "#fff", padding: 0 }} />
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
              <Button size="small" variant="contained" onClick={clearBounds}>
                Clear 'x'
              </Button>
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

// const TextFieldStyled = mStyled(TextField)({
//   color: "white",
// });

const Control = styled.div`
  margin-bottom: 15px;

  button {
    width: 100%;
  }
  /* padding-bottom: 10px; */
  /* border-bottom: 1px solid rgba(255, 255, 255, 0.5); */
`;

const ControlsStyle = styled.div`
  position: absolute;
  z-index: 1;
  border-radius: 0px 0 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  color: white;
  padding: ${(props) => (props.isOpen ? "0 10px" : "0 0")};
  width: ${(props) => (props.showControls ? "210px" : "30px")};
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
