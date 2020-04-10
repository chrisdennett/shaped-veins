import React from "react";
import styled from "styled-components";

const Cheatsheet = () => {
  return (
    <Holder>
      <Sheet>
        <h1>Cheatsheet</h1>
        <Shortcuts>
          <div>
            <span>"c"</span>: toggle this Cheatsheet
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
        </Shortcuts>
      </Sheet>
    </Holder>
  );
};

export default Cheatsheet;

const Holder = styled.div`
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
  font-size: 1.5rem;

  h1 {
    margin: 5px 0;
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
