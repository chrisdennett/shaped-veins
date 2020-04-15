import React, { useState } from "react";
import styled from "styled-components";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import { useLocalStorage } from "../hooks/useLocalStorage";
// ui
import InfoIcon from "@material-ui/icons/InfoRounded";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
// comps
import { Info } from "../info/Info";

export const Controls = ({
  drawOuterShape,
  removeLastNode,
  toggleEditing,
  save_as_svg,
  isEditing,
  reRun,
  isDrawingOuterShape,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useLocalStorage("showInfo", true);
  const isInEditMode = isEditing || isDrawingOuterShape;

  useHotkeys("i", () => setShowInfo((prev) => !prev));
  useHotkeys("h", () => setShowControls((prev) => !prev));
  useHotkeys("e", () => onDoneClick());
  useHotkeys("r", () => reRun());
  useHotkeys("z", () => removeLastNode());
  useHotkeys("x", () => drawOuterShape(true));
  useHotkeys("s", () => save_as_svg());

  const onShowCheatSheet = () => setShowInfo(true);
  const onInfoClick = () => setShowInfo(false);

  const onDoneClick = () => {
    if (isEditing) {
      toggleEditing();
    } else if (isDrawingOuterShape) {
      drawOuterShape(false);
    } else {
      toggleEditing();
    }
  };

  if (isInEditMode) {
    return (
      <DoneButtonStyle>
        <Button
          size="small"
          variant="contained"
          onClick={onDoneClick}
          style={{ background: "green", marginRight: 10, color: "white" }}
        >
          DONE 'e'
        </Button>
        <Button size="small" variant="contained" onClick={removeLastNode}>
          Remove Last Point 'z'
        </Button>
      </DoneButtonStyle>
    );
  }

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
              <Button size="small" variant="contained" onClick={toggleEditing}>
                Edit 'e'
              </Button>
            </Control>

            <Control>
              <Button size="small" variant="contained" onClick={reRun}>
                Rerun 'r'
              </Button>
            </Control>

            <Control>
              <Button
                size="small"
                color={"secondary"}
                variant="contained"
                onClick={drawOuterShape}
                startIcon={<DeleteIcon />}
              >
                Remake Outer 'x'
              </Button>
            </Control>

            {/* <Control>
              <Button size="small" variant="contained" onClick={save_as_svg}>
                Save SVG 's'
              </Button>
            </Control> */}
          </>
        )}
      </ControlsStyle>
    </>
  );
};

const Control = styled.div`
  margin-bottom: 15px;

  button {
    width: 100%;
  }
`;

const DoneButtonStyle = styled.div`
  position: absolute;
  z-index: 2;
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
