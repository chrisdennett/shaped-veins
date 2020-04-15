import React, { useRef } from "react";
import styled from "styled-components";
import { useAnimationFrame } from "../hooks/useAnimationFrame";
import * as Vec2 from "vec2";
import Network from "../core/Network";
import { getGridOfAttractors } from "../core/AttractorPatterns";
import Node from "../core/Node";
import Path from "../core/Path";
// import { setupKeyListeners } from "../core/KeyboardInteractions";
import { getCircleOfPoints } from "../core/Utilities";
import Settings from "../core/Settings";

let network;

const Display = ({ width, height, bounds, isPaused }) => {
  useAnimationFrame(() => {
    network.update();
    network.draw();
  });

  const canvasRef = useRef(null);

  React.useEffect(() => {
    if (canvasRef) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      // ctx.drawImage(framedCanvas, 0, 0);
      network = new Network(ctx, Settings);
      resetNetwork();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  React.useEffect(() => {
    resetNetwork();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds]);

  const resetNetwork = () => {
    const ctx = canvasRef.current.getContext("2d");
    network.reset();
    network.bounds = getBounds({ ctx, bounds, width, height });
    network.obstacles = getObstacles(ctx);
    network.attractors = getAttractors(ctx);
    addStartNode(ctx);
  };

  return (
    <Container>
      <CanvasHolder>
        <CanvasStyled ref={canvasRef} />
      </CanvasHolder>
    </Container>
  );
};

export default Display;

// STYLES
const Container = styled.div`
  background: #fff;
  border-radius: 10px;
  background-image: url(./img/cutting-mat-tile.png);
`;

const CanvasHolder = styled.div`
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CanvasStyled = styled.canvas`
  max-width: 100%;
  max-height: 100%;
`;

const addStartNode = (ctx) => {
  network.addNode(
    new Node(null, new Vec2(150, 870), true, ctx, Settings, undefined)
  );
};

const getObstacles = (ctx) => {
  const obstacleArr = [
    new Path(getCircleOfPoints(451, 450, 100, 100), "Obstacle", ctx),
  ];
  return obstacleArr;
};

const getBounds = ({ ctx, bounds, width, height }) => {
  const defaultBounds = [
    [0, 0], // top left corner
    [width, 0], // top right corner
    [width, height], // bottom right corner
    [0, height], // bottom left corner
  ];

  let boundsPoints = defaultBounds;
  if (bounds && bounds.length > 0) {
    boundsPoints = bounds;
  }

  const boundArr = [new Path(boundsPoints, "Bounds", ctx, Settings)];
  return boundArr;
};

const getAttractors = (ctx) => {
  let gridAttractors = getGridOfAttractors(150, 150, ctx, 10, network.bounds);
  return gridAttractors;
};
