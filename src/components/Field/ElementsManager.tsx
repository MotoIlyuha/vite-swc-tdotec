import Image from "react-bootstrap/Image";
import {Node} from "reactflow";
import {BaseNodeData, CircuitElementType, NodeProps} from "../types";

import delete_icon from "../../assets/Icons/delete_icon.png";


interface ElementsManagerProps {
    nodes: BaseNodeData<NodeProps>[];
    selectNodes: (nodes: Node[]) => void;
    elements: CircuitElementType;
    onNodeDelete: (arg0: string) => void;
}

export default function ElementsManager({nodes, selectNodes, elements, onNodeDelete}: ElementsManagerProps) {

    const handleElementClick = (node: Node) => {
        selectNodes([node]);
        node.selected = true;
        node.className = 'selected';
    }

    return (
        <div className="elements-manager">
            {nodes.map((node) => (
                <div className={'element ' + (node.selected ? 'selected' : '')} key={node.id}
                     onClick={() => handleElementClick(node)}>
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
            <p>{nodes.map((node) => node.selected ? node.id : '')}</p>
        </div>
    );
}