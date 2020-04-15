import React from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

export const Info = ({ onClick }) => {
  return (
    <Holder onClick={onClick}>
      <Sheet>
        <h1>Info</h1>

        <Button
          endIcon={<OpenInNewIcon />}
          color="default"
          variant="contained"
          href={"https://artfly.io/shaped-veins"}
          target={"_blank"}
          rel="noreferrer"
          style={{ marginBottom: 10, width: "100%" }}
        >
          What & why is this thing?
        </Button>

        <Shortcuts>
          <div>
            <span>"e"</span>: toggle editing
          </div>
          <div>
            <span>"r"</span>: re-run
          </div>
          <div>
            <span>"s"</span>: save
          </div>
          <div>
            <span>"i"</span>: toggle this info thing
          </div>
        </Shortcuts>
      </Sheet>
    </Holder>
  );
};

const Holder = styled.div`
  z-index: 10;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Sheet = styled.div`
  background: white;
  border-radius: 10px;
  max-width: 800px;
  min-width: 300px;
  padding: 2%;
  text-align: left;

  h1 {
    margin: 5px 0;
    text-align: center;
  }
`;

const Shortcuts = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1.7em;

  span {
    color: red;
  }
`;
