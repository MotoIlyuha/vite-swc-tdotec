import {useCallback} from 'react';
import {
    useStore,
    EdgeLabelRenderer,
    EdgeProps,
    useReactFlow
} from 'reactflow';

import './buttonedge.css';

// const onEdgeClick = (evt: { stopPropagation: () => void; }, id: any) => {
//     evt.stopPropagation();
//     alert(`remove ${id}`);
// };

export default function DeletableStepEdge({id, source, target, markerEnd, style}: EdgeProps) {
    const {setEdges} = useReactFlow();
    const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
    const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

    if (!sourceNode || !targetNode) {
        return null;
    }


    const onEdgeClick = () => {
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    };

    return (
        <>
            {/*<StepEdge {...props} markerEnd={markerEnd} style={style}/>*/}
            <path
                id={id}
                className="react-flow__edge-path"
                strokeWidth={5}
                markerEnd={markerEnd}
                style={style}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        fontSize: 12,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                >
                    <button className="delete_button" onClick={onEdgeClick}>
                        ×
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
