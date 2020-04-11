import React from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";

export const Info = ({ onClick }) => {
  return (
    <Holder onClick={onClick}>
      <Sheet>
        <h1>Info</h1>

        <Button
          color="secondary"
          variant="outlined"
          href="#contained-buttons"
          href={"https://artfly.io/projector-shape-mapping-thing/"}
          target={"_blank"}
          rel="noreferrer"
          style={{ marginBottom: 10, width: "100%" }}
        >
          Bit about what this is...
        </Button>

        <Shortcuts>
          <div>
            <span>"i"</span>: toggle this info thing
          </div>
          <div>
            <span>"h"</span>: toggle controls
          </div>
          <div>
            <span>"a"</span>: toggle animation
          </div>
          <div>
            <span>"e"</span>: toggle editing
          </div>
          <div>
            <span>"z"</span>: remove last point
          </div>
          <div>
            <span>"x"</span>: remove last pyramid
          </div>
          <div>
            <span>"0, 1, 2, or 3"</span>: diff animations
          </div>
        </Shortcuts>
      </Sheet>
    </Holder>
  );
};

const Holder = styled.div`
  z-index: 2;
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
