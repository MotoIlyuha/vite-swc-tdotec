import {Position, internalsSymbol, Node, Handle} from 'reactflow';
import {CircuitNode, NodeProps} from "../../types.ts";

interface Handle {
    width: number;
    height: number;
    x: number;
    y: number;
    position: Position;
}

interface NodeCenter {
    x: number;
    y: number;
}

interface EdgeParams {
    sx: number;
    sy: number;
    tx: number;
    ty: number;
    sourcePos: Position;
    targetPos: Position;
}

function getNodeCenter(node: Node): NodeCenter {
    return {
        x: (node.positionAbsolute?.x ?? 0) + (node.width ?? 0) / 2,
        y: (node.positionAbsolute?.y ?? 0) + (node.height ?? 0) / 2,
    };
}

function getHandleCoordsByPosition(node: Node, handlePosition: Position): [number, number] {
    const handle = node[internalsSymbol]?.handleBounds?.source?.find(
        (h: Handle) => h.position === handlePosition
    );

    if (!handle) {
        console.log(node, handlePosition);
        return [0, 0];
        // throw new Error('Handle not found');
    }

    let offsetX = handle.width / 2;
    let offsetY = handle.height / 2;

    switch (handlePosition) {
        case Position.Left:
            offsetX = 0;
            break;
        case Position.Right:
            offsetX = handle.width;
            break;
        case Position.Top:
            offsetY = 0;
            break;
        case Position.Bottom:
            offsetY = handle.height;
            break;
    }

    const x = (node.positionAbsolute?.x ?? 0) + handle.x + offsetX;
    const y = (node.positionAbsolute?.y ?? 0) + handle.y + offsetY;

    return [x, y];
}

function getParams(nodeA: CircuitNode<NodeProps>, nodeB: CircuitNode<NodeProps>): [number, number, Position] {
    const centerA = getNodeCenter(nodeA);
    const centerB = getNodeCenter(nodeB);

    const horizontalDiff = Math.abs(centerA.x - centerB.x);
    const verticalDiff = Math.abs(centerA.y - centerB.y);

    let position: Position;

    const nodeAOrientation = nodeA.data.orientation;
    const nodeBOrientation = nodeB.data.orientation;

    if (nodeAOrientation === 'ver' && nodeBOrientation === 'hor') {
        position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
    } else if (nodeAOrientation === 'hor' && nodeBOrientation === 'ver') {
        position = centerA.x > centerB.x ? Position.Left : Position.Right;
    } else if (nodeAOrientation === 'hor' && nodeBOrientation === 'hor') {
        position = centerA.x > centerB.x ? Position.Left : Position.Right;
    } else if (nodeAOrientation === 'ver' && nodeBOrientation === 'ver') {
        position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
    } else {
        if (horizontalDiff > verticalDiff) {
            position = centerA.x > centerB.x ? Position.Left : Position.Right;
        } else {
            position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
        }
    }

    const [x, y] = getHandleCoordsByPosition(nodeA, position);
    return [x, y, position];
}

export function getEdgeParams(source: CircuitNode<NodeProps>, target: CircuitNode<NodeProps>): EdgeParams {
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

