import Image from "react-bootstrap/Image";
import {BaseNodeData, CircuitElementType, NodeProps} from "../types";

import delete_icon from "../../assets/Icons/delete_icon.png";
import arrow_icon from "../../assets/Icons/arrow_icon.png";
import {useCallback, useState} from "react";
import {CircuitElementContextMenu} from "../Nodes/ContextMenu/ContextMenu.tsx";


interface ElementsManagerProps {
    nodes: BaseNodeData<NodeProps>[];
    selectedNodes: BaseNodeData<NodeProps>[];
    setSelectedNodes: (node: BaseNodeData<NodeProps>[]) => void;
    elements: CircuitElementType;
    onNodeDelete: (arg0: string) => void;
}

export default function ElementsManager({nodes, selectedNodes, setSelectedNodes, elements, onNodeDelete}: ElementsManagerProps) {

    const [showValues, setShowValues] = useState<boolean[]>(nodes.map(() => false));
    const [rotateValues, setRotateValues] = useState<boolean[]>(nodes.map(() => false));

    const handleNodeClick = useCallback((node: BaseNodeData<NodeProps>) => {
        setSelectedNodes([node]);
    }, [setSelectedNodes]);

    const isSelected = useCallback((node: BaseNodeData<NodeProps>) =>
        selectedNodes.some(selectedNode => selectedNode.id === node.id),
    [selectedNodes]);

    const toggleShowValues = useCallback((index: number) => {
        setShowValues(prevShowValues => prevShowValues.map((value, i) => i === index ? !value : value));
    }, []);

    const toggleRotateValues = useCallback((index: number) => {
        setRotateValues(prevRotateValues => prevRotateValues.map((value, i) => i === index ? !value : value));
    }, []);

    return (
        <div style={{padding: '8px 0'}}>
        <div className="elements-manager">
            {nodes.map((node, index) => (
                <div className={'element ' + (isSelected(node) ? 'selected' : '')} key={node.id}
                     onClick={() => handleNodeClick(node)}>
                    <div className='element-header'>
                    <Image src={elements[node.type].icon}/>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>{elements[node.type]?.name}</div>
                        <Image className='show_values' src={arrow_icon} onClick={(e) => {
                            e.stopPropagation();
                            toggleShowValues(index);
                            toggleRotateValues(index);
                        }} style={{
                                transform: rotateValues[index] ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease-in-out'
                            }}/>
                    </div>
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
                {showValues[index] && <CircuitElementContextMenu id={node.id} data={node.data} type={node.type} position={node.position}/>}
                </div>
            ))}
        </div>
        </div>
    );
}