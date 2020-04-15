import React, { useRef } from "react";
import styled from "styled-components";
import { useAnimationFrame } from "../hooks/useAnimationFrame";
import * as Vec2 from "vec2";
import Network from "../core/Network";
import { getGridOfAttractors } from "../core/AttractorPatterns";
import Node from "../core/Node";
import Path from "../core/Path";
// import { setupKeyListeners } from "../core/KeyboardInteractions";
// import { getCircleOfPoints } from "../core/Utilities";
import Settings from "../core/Settings";

let network;

const Display = ({
  width,
  height,
  bounds,
  obstacles,
  startPoints,
  reRunId,
  setCanvasRef,
}) => {
  useAnimationFrame(() => {
    network.update();
    network.draw();
  });

  const canvasRef = useRef(null);

  React.useEffect(() => {
    if (canvasRef) {
      setCanvasRef(canvasRef);
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
  }, [bounds, startPoints, obstacles, reRunId]);

  const resetNetwork = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    network.reset();
    network.bounds = getBounds({ ctx, bounds, width, height });
    network.obstacles = getObstacles(ctx, obstacles);
    network.attractors = getAttractors(ctx);
    addStartNodes(ctx, startPoints);
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
  background: #eee;
`;

const CanvasHolder = styled.div`
  padding: 0;
`;

const CanvasStyled = styled.canvas``;

const addStartNodes = (ctx, startPoints) => {
  for (let pt of startPoints) {
    network.addNode(
      new Node(null, new Vec2(pt[0], pt[1]), true, ctx, Settings, undefined)
    );
  }
};

const getObstacles = (ctx, obstacles) => {
  let obstacleArr = [];

  if (obstacles && obstacles.length > 0) {
    obstacleArr.push(new Path(obstacles, "Obstacle", ctx));
  }

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
