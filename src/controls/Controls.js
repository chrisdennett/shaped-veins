import React, { useState } from "react";
import styled from "styled-components";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import { useLocalStorage } from "../hooks/useLocalStorage";
// ui
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import EditIcon from "@material-ui/icons/Edit";
import RefreshIcon from "@material-ui/icons/Refresh";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import DoneIcon from "@material-ui/icons/Done";
import AddIcon from "@material-ui/icons/Add";
//
import IconButton from "@material-ui/core/IconButton";
// comps
import { Info } from "../info/Info";

export const Controls = ({
  hasBounds,
  hasObstacles,
  setBounds,
  setStartPoints,
  setObstacles,
  setIsEditing,
  removeLastNode,
  toggleEditing,
  isEditing,
  isAddingBounds,
  isAddingStartPoints,
  isAddingObstacles,
  reRun,
  setIsAddingBounds,
  setIsAddingStartPoints,
  setIsAddingObstacles,
}) => {
  const [showInfo, setShowInfo] = useLocalStorage("showInfo", true);

  // useHotkeys("i", () => setShowInfo((prev) => !prev));
  // useHotkeys("e", () => onDoneClick());
  // useHotkeys("r", () => reRun());
  // useHotkeys("z", () => removeLastNode());
  // useHotkeys("x", () => drawOuterShape(true));
  // useHotkeys("s", () => save_as_svg());

  const onDoneClick = () => {
    setIsAddingBounds(false);
    setIsAddingObstacles(false);
    setIsAddingStartPoints(false);

    setIsEditing(false);
  };

  return (
    <>
      {showInfo && <Info onClick={() => setShowInfo(false)} />}
      <StyledControlBar>
        {!isEditing && (
          <StyledButtonSet>
            <IconButton onClick={toggleEditing} aria-label="edit">
              <EditIcon />
            </IconButton>
            <IconButton onClick={reRun} aria-label="refresh">
              <RefreshIcon />
            </IconButton>
            <IconButton onClick={() => setShowInfo(true)} aria-label="help">
              <HelpOutlineIcon />
            </IconButton>
          </StyledButtonSet>
        )}

        {isEditing && (
          <>
            <StyledButtonSet>
              <IconButton
                onClick={onDoneClick}
                aria-label="done"
                style={{ background: "green", color: "white" }}
              >
                <DoneIcon />
              </IconButton>
            </StyledButtonSet>

            <StyledButtonSet showDividerAbove>
              <IconButton
                onClick={() => setIsAddingStartPoints(!isAddingStartPoints)}
                aria-label="done"
                style={{ background: "yellow", color: "black" }}
              >
                {isAddingStartPoints ? <DoneIcon /> : <AddIcon />}
              </IconButton>
              {!hasBounds && (
                <IconButton
                  onClick={() => setIsAddingBounds(true)}
                  aria-label="done"
                  style={{ background: "blue", color: "white" }}
                >
                  <AddIcon />
                </IconButton>
              )}

              {!hasObstacles && (
                <IconButton
                  onClick={() => setIsAddingObstacles(true)}
                  aria-label="done"
                  style={{ background: "red", color: "white" }}
                >
                  <AddIcon />
                </IconButton>
              )}
            </StyledButtonSet>

            {/* DELETE BUTTS */}
            <StyledButtonSet showDividerAbove>
              {hasBounds && (
                <IconButton
                  onClick={() => setBounds([])}
                  aria-label="done"
                  style={{ background: "blue", color: "white" }}
                >
                  <DeleteForeverIcon />
                </IconButton>
              )}
              <IconButton
                onClick={() => setStartPoints([])}
                aria-label="done"
                style={{ background: "yellow", color: "black" }}
              >
                <DeleteForeverIcon />
              </IconButton>
              {hasObstacles && (
                <IconButton
                  onClick={() => setObstacles([])}
                  aria-label="done"
                  style={{ background: "red", color: "white" }}
                >
                  <DeleteForeverIcon />
                </IconButton>
              )}
            </StyledButtonSet>
          </>
        )}
      </StyledControlBar>
    </>
  );
};

const StyledControlBar = styled.div`
  position: fixed;
  z-index: 9;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  background: white;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  padding: 5px;
`;

const StyledButtonSet = styled.div`
  display: flex;
  flex-direction: column;
  border-top: ${(props) =>
    props.showDividerAbove ? "1px solid grey" : "none"};
  padding-top: ${(props) => (props.showDividerAbove ? "10px" : "none")};
  margin-top: ${(props) => (props.showDividerAbove ? "20px" : "none")};
  button {
    margin: 5px 0;
  }
`;

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
