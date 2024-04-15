import Image from "react-bootstrap/Image";
import {BaseNodeData, CircuitElementType, NodeProps} from "../types";

import delete_icon from "../../assets/Icons/delete_icon.png";
import {useCallback} from "react";


interface ElementsManagerProps {
    nodes: BaseNodeData<NodeProps>[];
    selectedNodes: BaseNodeData<NodeProps>[];
    setSelectedNodes: (node: BaseNodeData<NodeProps>[]) => void;
    elements: CircuitElementType;
    onNodeDelete: (arg0: string) => void;
}

export default function ElementsManager({nodes, selectedNodes, setSelectedNodes, elements, onNodeDelete}: ElementsManagerProps) {

    const handleNodeClick = useCallback((node: BaseNodeData<NodeProps>) => {
        setSelectedNodes([node]);
    }, [setSelectedNodes]);

    const isSelected = useCallback((node: BaseNodeData<NodeProps>) =>
        selectedNodes.some(selectedNode => selectedNode.id === node.id),
    [selectedNodes]);

    return (
        <div className="elements-manager">
            {nodes.map((node) => (
                <div className={'element ' + (isSelected(node) ? 'selected' : '')} key={node.id}
                     onClick={() => handleNodeClick(node)}>
                    <Image src={elements[node.type].icon}/>
                    <div>{elements[node.type]?.name}</div>
                    <button className='delete-button' onClick={(e) => {
                        e.stopPropagation();
                        onNodeDelete(node.id);
                    }}
                            style={{
                                borderRadius: '4px',
                                borderWidth: '0',
                                borderColor: '#ffacbb',
                            }}>
                        <Image src={delete_icon} style={{
                            width: '16px',
                            height: '16px',
                        }}/>
                    </button>
                </div>
            ))}
        </div>
    );
}