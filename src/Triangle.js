import React from "react";
import { motion } from "framer-motion";

export const Triangle = ({
  points,
  index,
  hue,
  isAnimating,
  isAnimating2,
  isEditing,
}) => {
  const peakNode = points[0];

  return (
    <g>
      <motion.path
        stroke={isAnimating && !isEditing ? "white" : "white"}
        strokeWidth={4}
        d={`M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y} L ${points[2].x},${points[2].y} Z`}
        animate={{
          pathLength: 1,
          pathOffset: 0,
          fill: `hsl(${hue}, ${100 - index * 20}%, ${12 + 20 * index}%)`,
          transition: { duration: 3, flip: Infinity },
        }}
        initial={{
          pathLength: 0,
          pathOffset: 1,
          fill: `hsl(${hue + 360}, ${100 - index * 20}%, ${12 + 20 * index}%)`,
          transition: { duration: 3, flip: Infinity },
        }}
      />

      {isAnimating2 && (
        <motion.line
          initial={{
            x1: peakNode.x,
            x2: peakNode.x,
            y1: peakNode.y,
            y2: peakNode.y,
            transition: { duration: 3, flip: Infinity },
          }}
          animate={{
            x1: points[1].x,
            y1: points[1].y,
            x2: points[2].x,
            y2: points[2].y,
            transition: { duration: 3, flip: Infinity },
          }}
          stroke={"white"}
          strokeWidth={5}
        />
      )}
    </g>
  );
};
