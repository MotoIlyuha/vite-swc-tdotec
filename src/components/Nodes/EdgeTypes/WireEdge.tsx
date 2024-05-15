import {getSmoothStepPath, EdgeLabelRenderer, useReactFlow, BaseEdge, EdgeProps} from 'reactflow';
import './buttonedge.css';


function SimpleFloatingEdge({id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition}: EdgeProps) {

    const {setEdges} = useReactFlow();

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 2,
        offset: 0,
    });

    const onEdgeClick = () => {
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    };

    return (
        <>
            <BaseEdge path={edgePath} id={id}/>
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