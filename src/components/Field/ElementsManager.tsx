import Image from "react-bootstrap/Image";
import {BaseNodeData, CircuitElementType, NodeProps} from "../types";
import {useSelection} from "../SelectedNodesContext";

import delete_icon from "../../assets/Icons/delete_icon.png";
import {useEffect} from "react";


interface ElementsManagerProps {
    nodes: BaseNodeData<NodeProps>[];
    elements: CircuitElementType;
    onNodeDelete: (nodeId: string) => void;
}

export default function ElementsManager({nodes, elements, onNodeDelete}: ElementsManagerProps) {

    const {selectedNodes, setSelectedNodes} = useSelection();

    useEffect(() => {
        setSelectedNodes(selectedNodes);
        console.log(selectedNodes);
    }, [selectedNodes, setSelectedNodes]);

    return (
        <div className="elements-manager">
            {nodes.map((node) => (
                <div className={'element ' + (selectedNodes.find(selected => selected.id === node.id) ? 'selected' : '')} key={node.id}
                     onClick={() => {
                         setSelectedNodes([node]);
                     }}>
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
            <p>{nodes.map((node) => selectedNodes.find(selected => selected.id === node.id) ? node.id : '')}</p>
        </div>
    );
}