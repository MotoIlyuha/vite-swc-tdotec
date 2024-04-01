import React from "react";
import {useNodes} from "reactflow";
import './SideBar.css'
import Image from "react-bootstrap/Image";

import resistor_img from './Icons/resistor.png';
import lamb_img from './Icons/lamb.png';
import switcher_img from './Icons/switcher.png';
import battery_img from './Icons/battery.png';

interface SidebarProps {
    width: number; // Ширина Sidebar
}

const Sidebar: React.FC<SidebarProps> = ({width}) => {

    const nodes = useNodes();
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        if (event.dataTransfer) {
            event.dataTransfer.setData('application/reactflow', nodeType);
            event.dataTransfer.effectAllowed = 'move';
        }
    };

    const elements: Record<string, string> = {
        'resistor': resistor_img,
        'battery': battery_img,
        'lamb': lamb_img,
        'switcher': switcher_img
    }

    return (
        <div className='sidebar d-flex flex-column justify-content-between' style={{width: `${width}px`}}>
            <div>
                {nodes.map((node) => (
                    <div key={node.id}>
                        Node {node.id} -
                        x: {node.position.x.toFixed(2)},
                        y: {node.position.y.toFixed(2)}
                    </div>
                ))}
            </div>
            <div>
                <div className="description">Перетащите элемент, чтобы добавить его на рабочую область</div>
                <div className="add-menu">
                {Object.keys(elements).map((key) => (
                    <div className={"dndnode " + key} onDragStart={(event) => onDragStart(event, key)} draggable>
                        <Image src={elements[key]}/>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

