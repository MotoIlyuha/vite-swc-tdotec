import { Position, internalsSymbol, Node } from 'reactflow';


function getParams(nodeA: Node, nodeB: Node): [number, number, Position] {
  const centerA = getNodeCenter(nodeA);
  const centerB = getNodeCenter(nodeB);

  const horizontalDiff = Math.abs(centerA.x - centerB.x);
  const verticalDiff = Math.abs(centerA.y - centerB.y);

  let position: Position;

  if (horizontalDiff > verticalDiff) {
    position = centerA.x > centerB.x ? Position.Left : Position.Right;
  } else {
    position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
  }

  const [x, y] = getHandleCoordsByPosition(nodeA, position);
  return [x, y, position];
}

function getHandleCoordsByPosition(node: Node, handlePosition: Position) {
  const handle = node[internalsSymbol]?.handleBounds?.source?.find(
    (h) => h.position === handlePosition
  );

  let offsetX = handle?.width ?? 0 / 2;
  let offsetY = handle?.height ?? 0 / 2;

  switch (handlePosition) {
    case Position.Left:
      offsetX = 0;
      break;
    case Position.Right:
      offsetX = handle?.width ?? 0;
      break;
    case Position.Top:
      offsetY = 0;
      break;
    case Position.Bottom:
      offsetY = handle?.height ?? 0;
      break;
  }

  const x = (node.positionAbsolute?.x ?? 0) + (handle?.x ?? 0) + offsetX;
  const y = (node.positionAbsolute?.y ?? 0) + (handle?.y ?? 0) + offsetY;

  return [x, y];
}

function getNodeCenter(node: Node) {
  return {
    x: (node.positionAbsolute?.x ?? 0) + (node.width ?? 0) / 2,
    y: (node.positionAbsolute?.y ?? 0) + (node.height ?? 0) / 2,
  };
}

export function getEdgeParams(source: Node, target: Node) {
  const [sx, sy, sourcePos] = getParams(source, target);
  const [tx, ty, targetPos] = getParams(target, source);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
}
