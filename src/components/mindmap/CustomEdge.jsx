import React, { memo } from "react";
import { BaseEdge, getBezierPath } from "@xyflow/react";

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const solid = data?.solid || selected;
  const stroke = solid ? "#2563eb" : "#9aa0a6";
  const dash = solid ? undefined : "3 5";
  const width = solid ? 2.5 : 1.5;

  return (
    <g>
      <BaseEdge path={edgePath} style={{ stroke, strokeWidth: width, strokeDasharray: dash }} />
      <circle cx={targetX} cy={targetY} r={4} fill="#ffffff" stroke={stroke} strokeWidth={2} />
    </g>
  );
};

export default memo(CustomEdge);
