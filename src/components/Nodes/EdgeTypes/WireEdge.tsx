import { useCallback } from 'react';
import {useStore, SmoothStepEdgeProps, getSmoothStepPath} from 'reactflow';

import { getEdgeParams } from './utils.js';

export default function WireEdge({ id, source, target, markerEnd, style }: SmoothStepEdgeProps) {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  function handleCLick() {
    console.log(sx, sy, tx, ty, sourcePos, targetPos);
  }

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      strokeWidth={5}
      markerEnd={markerEnd}
      style={style}
      onClick={handleCLick}
    />
  );
}
