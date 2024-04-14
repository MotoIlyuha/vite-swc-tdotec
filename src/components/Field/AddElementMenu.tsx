import Image from "react-bootstrap/Image";
import {DragEvent, useState} from "react";
import './style.css';
import {CircuitElementType, NodeType} from "../types.ts";


const onDragStart = (event: DragEvent, nodeType: NodeType) => {
    if (event.dataTransfer) {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    }
};

export default function AddElementMenu({ elements }: { elements: CircuitElementType }) {

    const [hoveredElement, setHoveredElement] = useState('Наведите курсор на элемент');

    return (
        <div className='add-element-menu'>
            <div className="description">Перетащите элемент, чтобы <br/> добавить его на рабочую область</div>
            <div className="add-menu">
                {Object.values(NodeType).map((node_type: NodeType) => (
                    <div key={elements[node_type].name} className={'add-menu-element'}
                         onDragStart={(event) => onDragStart(event, node_type)}
                         onMouseEnter={() => setHoveredElement(elements[node_type].name)}
                         onMouseLeave={() => setHoveredElement('Наведите курсор на элемент')} draggable>
                        <Image src={elements[node_type].icon}/>
                    </div>
                ))}
            </div>
            <div className='name'>{hoveredElement}</div>
        </div>
    )
}