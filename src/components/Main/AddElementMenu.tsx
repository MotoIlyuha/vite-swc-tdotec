import Image from "react-bootstrap/Image";
import {DragEvent, useState} from "react";
import './style.css';
import {NodeType} from "../types.ts";
import {useReactFlow} from "./ReactFlowContext";
import {elements} from "../defaults.ts";


const onDragStart = (event: DragEvent, nodeType: NodeType) => {
    if (event.dataTransfer) {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    }
};

export default function AddElementMenu() {

    const [hoveredElement, setHoveredElement] = useState('');
    const {uniquePowerSource: uniquePS} = useReactFlow();

    const isEnabled = (node_type: NodeType) => {
        if (node_type === NodeType.PowerSource)
            return uniquePS();
        else return true;
    }

    return (
        <div className='add-element-menu'>
            <div>
                <span>Основные элементы</span>
                <div className='add-menu main-elements' draggable={false}>
                    {Object.values(NodeType).map((node_type: NodeType) => (
                        !node_type.includes('meter') ?
                        <div key={elements[node_type].name} className={'add-menu-element ' + (isEnabled(node_type) ? '' : 'disabled')}
                             onDragStart={(event) => onDragStart(event, node_type)}
                             onMouseEnter={() => setHoveredElement(elements[node_type].name)}
                             onMouseLeave={() => setHoveredElement('')}
                             draggable={isEnabled(node_type)}>
                            <Image src={elements[node_type].icon} draggable={false}/>
                        </div> : null
                    ))}
                </div>
                <span>Измерительные элементы</span>
                <div className='add-menu metering-elements'>
                    {Object.values(NodeType).map((node_type: NodeType) => (
                        node_type.includes('meter') ?
                        <div key={elements[node_type].name} className={'add-menu-element'}
                             onDragStart={(event) => onDragStart(event, node_type)}
                             onMouseEnter={() => setHoveredElement(elements[node_type].name)}
                             onMouseLeave={() => setHoveredElement('')} draggable>
                            <Image src={elements[node_type].icon}/>
                        </div> : null
                    ))}
                </div>
                <div className='element-tooltip' style={{
                    display: hoveredElement ? 'block' : 'none',
                }}>
                    {hoveredElement}
                </div>
            </div>
        </div>
    )
}