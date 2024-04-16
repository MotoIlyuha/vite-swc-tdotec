import {CSSProperties, useCallback} from 'react';
import {useStore, getSmoothStepPath, EdgeLabelRenderer, useReactFlow, BaseEdge} from 'reactflow';
import {getEdgeParams} from './utils';
import './buttonedge.css';


interface SimpleFloatingEdgeProps {
    id: string;
    source: string;
    target: string;
    markerEnd?: string;
    style?: CSSProperties;
}

function SimpleFloatingEdge({id, source, target, markerEnd, style}: SimpleFloatingEdgeProps) {
    const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
    const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

    const { setEdges } = useReactFlow();

    if (!sourceNode || !targetNode) {
        return null;
    }

    const {sx, sy, tx, ty, sourcePos, targetPos} = getEdgeParams(sourceNode, targetNode);

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetPosition: targetPos,
        targetX: tx,
        targetY: ty,
    });

    const onEdgeClick = () => {
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    };

    return (
        <>
            <BaseEdge path={edgePath} id={id} markerEnd={markerEnd} style={style} />
            <EdgeLabelRenderer>
                <div
                    className="nodrag nopan"
                    style={{
                        position: 'absolute',
                        padding: 40,
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 10,
                        pointerEvents: 'all',
                    }}>
                    <button className="delete_button" onClick={onEdgeClick}>
                        ×
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}

export default SimpleFloatingEdge;