import React from "react";
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
import SaveIcon from "@material-ui/icons/Save";
//
import IconButton from "@material-ui/core/IconButton";
// comps
import { Info } from "../info/Info";

export const Controls = ({
  hasBounds,
  hasObstacles,
  hasStartingPoints,
  setBounds,
  setStartPoints,
  setObstacles,
  setIsEditing,
  toggleEditing,
  isEditing,
  isAddingBounds,
  isAddingStartPoints,
  isAddingObstacles,
  reRun,
  onSave,
  setIsAddingBounds,
  setIsAddingStartPoints,
  setIsAddingObstacles,
}) => {
  const [showInfo, setShowInfo] = useLocalStorage("showInfo", true);

  useHotkeys("i", () => setShowInfo((prev) => !prev));
  useHotkeys("e", () => (isEditing ? onDoneClick() : setIsEditing(true)));
  useHotkeys("r", () => reRun());
  useHotkeys("s", () => onSave());
  // useHotkeys("x", () => drawOuterShape(true));
  // useHotkeys("s", () => save_as_svg());

  const onDoneClick = () => {
    setIsAddingBounds(false);
    setIsAddingObstacles(false);
    setIsAddingStartPoints(false);

    setIsEditing(false);
  };

  const showAddBoundsButt = !hasBounds || isAddingBounds;
  const showObstaclesButt = !hasObstacles || isAddingObstacles;

  const setIsAddingOption = (option, isAdding) => {
    if (option === "bounds") {
      setIsAddingBounds(isAdding);
      setIsAddingObstacles(false);
      setIsAddingStartPoints(false);
    }
    if (option === "starts") {
      setIsAddingBounds(false);
      setIsAddingObstacles(false);
      setIsAddingStartPoints(isAdding);
    }
    if (option === "obstacles") {
      setIsAddingBounds(false);
      setIsAddingObstacles(isAdding);
      setIsAddingStartPoints(false);
    }
  };

  return (
    <>
      {showInfo && <Info onClick={() => setShowInfo(false)} />}

      <StyledControlBar>
        {!isEditing && (
          <StyledButtonSet>
            <IconButton onClick={() => setShowInfo(true)} aria-label="help">
              <HelpOutlineIcon />
            </IconButton>
            <IconButton onClick={toggleEditing} aria-label="edit">
              <EditIcon />
            </IconButton>
            <IconButton onClick={reRun} aria-label="refresh">
              <RefreshIcon />
            </IconButton>
            <IconButton onClick={onSave} aria-label="save">
              <SaveIcon />
            </IconButton>
          </StyledButtonSet>
        )}

        {isEditing && (
          <>
            <StyledButtonSet>
              <IconButton onClick={onDoneClick} aria-label="done">
                <DoneIcon />
              </IconButton>
            </StyledButtonSet>

            <StyledButtonSet showDividerAbove>
              <IconButton
                onClick={() =>
                  setIsAddingOption("starts", !isAddingStartPoints)
                }
                aria-label="add start points"
                style={{ background: "yellow", color: "black" }}
              >
                {isAddingStartPoints ? <DoneIcon /> : <AddIcon />}
              </IconButton>

              {showAddBoundsButt && (
                <IconButton
                  onClick={() => setIsAddingOption("bounds", !isAddingBounds)}
                  aria-label="add bounds"
                  style={{ background: "blue", color: "white" }}
                >
                  {isAddingBounds ? <DoneIcon /> : <AddIcon />}
                </IconButton>
              )}

              {showObstaclesButt && (
                <IconButton
                  onClick={() =>
                    setIsAddingOption("obstacles", !isAddingObstacles)
                  }
                  aria-label="done"
                  style={{ background: "red", color: "white" }}
                >
                  {isAddingObstacles ? <DoneIcon /> : <AddIcon />}
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

              {hasStartingPoints && (
                <IconButton
                  onClick={() => setStartPoints([])}
                  aria-label="done"
                  style={{ background: "yellow", color: "black" }}
                >
                  <DeleteForeverIcon />
                </IconButton>
              )}

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
