import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useAnimationFrame } from "../hooks/useAnimationFrame";
import * as Vec2 from "vec2";
import Network from "../core/Network";
import { getGridOfAttractors } from "../core/AttractorPatterns";
import Node from "../core/Node";
import Path from "../core/Path";
// import { setupKeyListeners } from "../core/KeyboardInteractions";
// import { getCircleOfPoints } from "../core/Utilities";

let network;

const Display = ({
  width,
  height,
  bounds,
  isPaused,
  obstacles,
  startPoints,
  reRunId,
  setCanvasRef,
}) => {
  const [sourceImg, setSourceImg] = useState(null);
  const [imgData, setImgData] = useState(null);

  useAnimationFrame(() => {
    if (!network) return;
    network.update(isPaused);
    network.draw();
  });

  const canvasRef = useRef(null);

  React.useEffect(() => {
    if (!sourceImg) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = () => {
        setSourceImg(image);
        setImgData(getImgData(image));
      };
      // image.src = "./img/gove_750x1000.jpg";
      image.src = "./img/mona_537x800.jpg";
      // image.src = "./img/rainbow-800.jpg";
    }

    if (canvasRef && imgData) {
      setCanvasRef(canvasRef);
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      network = new Network(ctx, width, height);
      resetNetwork();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, imgData]);

  React.useEffect(() => {
    resetNetwork();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds, startPoints, obstacles, reRunId]);

  const resetNetwork = () => {
    if (!network) return;

    const ctx = canvasRef.current.getContext("2d");
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    network.reset();
    network.bounds = getBounds({ ctx, bounds, width, height });
    network.obstacles = getObstacles(ctx, obstacles);
    network.attractors = getAttractors(ctx);

    addStartNodes(ctx, startPoints, width, imgData);
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

const addStartNodes = (ctx, startPoints, width, imgData) => {
  // getImgData

  for (let pt of startPoints) {
    const vPt = new Vec2(pt[0], pt[1]);
    network.addNode(new Node(null, vPt, true, ctx, imgData, width));
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

  const boundArr = [new Path(boundsPoints, "Bounds", ctx)];
  return boundArr;
};

const getAttractors = (ctx) => {
  let gridAttractors = getGridOfAttractors(150, 150, ctx, 10, network.bounds);
  return gridAttractors;
};

const getImgData = (sourceImg) => {
  const sourceW = sourceImg.width;
  const sourceH = sourceImg.height;

  const newCanvas = document.createElement("canvas");
  const ctx = newCanvas.getContext("2d");
  newCanvas.width = sourceW;
  newCanvas.height = sourceH;

  ctx.drawImage(sourceImg, 0, 0, sourceW, sourceH, 0, 0, sourceW, sourceH);

  return ctx.getImageData(0, 0, sourceW, sourceH);
};
