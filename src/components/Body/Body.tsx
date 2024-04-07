import {useState} from "react";
import {ReactFlowProvider, Node, Edge} from "reactflow";
import Flow from "../Field/Flow";
import './Field.css'

import resistor_img from "../../assets/Icons/resistor_icon.svg";
import battery_img from "../../assets/Icons/battery_icon.svg";
import lamb_on_img from "../../assets/Icons/lamb_on_icon.svg";
import lamb_off_img from "../../assets/Icons/lamb_off_icon.svg";
import switcher_on_img from "../../assets/Icons/switcher_on_icon.svg";
import switcher_off_img from "../../assets/Icons/switcher_off_icon.svg";

const initialNodes: Node[] = [
    {id: '1', data: {orientation: 'hor'}, position: {x: 0, y: 0}, type: 'switcher'},
    {id: '2', data: {orientation: 'hor'}, position: {x: 0, y: 100}, type: 'resistor'},
    {id: '3', data: {orientation: 'hor'}, position: {x: 0, y: 200}, type: 'battery'},
    {id: '4', data: {orientation: 'hor'}, position: {x: 0, y: 300}, type: 'lamb'},
];

const initialEdges: Edge[] = [{id: 'e1-2', source: '1', target: '2', type: 'default'}];

const elements: Record<string, Record<string, string>> = {
    'resistor': {'name': 'Резистор', 'icon': resistor_img},
    'lamb': {'name': 'Лампа', 'icon': lamb_off_img, 'on_img': lamb_on_img, 'off_img': lamb_off_img},
    'switcher': {'name': 'Переключатель', 'icon': switcher_on_img, 'on_img': switcher_on_img, 'off_img': switcher_off_img},
    'battery': {'name': 'Аккумулятор', 'icon': battery_img},
}

export default function Body() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);

    return (
        <ReactFlowProvider>
            <Flow nodes={nodes} edges={edges} elements={elements} selectedNodes={selectedNodes}
                  setNodes={setNodes} setEdges={setEdges} setSelectedNodes={setSelectedNodes} />
        </ReactFlowProvider>
    )
}

