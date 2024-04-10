import {useState} from "react";
import {ReactFlowProvider, Node, Edge} from "reactflow";
import Flow from "../Field/Flow";
import './Field.css';

import {BaseNodeData, NodeProps} from '../Nodes/NodeTypes/NodeTypes.tsx';

import resistor_img from "../../assets/Icons/resistor_icon.svg";
import battery_img from "../../assets/Icons/battery_icon.svg";
import lamb_on_img from "../../assets/Icons/lamb_on_icon.svg";
import lamb_off_img from "../../assets/Icons/lamb_off_icon.svg";
import switcher_on_img from "../../assets/Icons/switcher_on_icon.svg";
import switcher_off_img from "../../assets/Icons/switcher_off_icon.svg";

const initialNodes: BaseNodeData<NodeProps>[] = [
    {id: 'powerSource-1', data: {power: 10}, position: {x: 140, y: 0}, orientation: 'hor', type: 'powerSource'},
    {id: 'switch-1', data: {switchState: false}, position: {x: 220, y: 40}, orientation: 'ver', type: 'switch'},
    {id: 'bulb-1', data: {brightness: 0}, position: {x: 140, y: 120}, orientation: 'hor', type: 'bulb'},
    {id: 'resistor-1', data: {resistance: 10}, position: {x: 100, y: 40}, orientation: 'ver', type: 'resistor'},
];

const initialEdges: Edge[] = [
    {id: 'wire_ps1-s1', source: 'powerSource-1', target: 'switch-1', type: 'wire'},
    {id: 'wire_s1-b1', source: 'switch-1', target: 'bulb-1', type: 'wire'},
    {id: 'wire_b1-r1', source: 'bulb-1', target: 'resistor-1', type: 'wire'},
    {id: 'wire_r1-ps1', source: 'resistor-1', target: 'powerSource-1', type: 'wire'},
];

const elements: Record<string, Record<string, string>> = {
    'resistor': {'name': 'Резистор', 'icon': resistor_img},
    'lamb': {
        'name': 'Лампа',
        'icon': lamb_off_img,
        'on_img': lamb_on_img,
        'off_img': lamb_off_img
    },
    'switcher': {
        'name': 'Переключатель',
        'icon': switcher_off_img,
        'on_img': switcher_on_img,
        'off_img': switcher_off_img
    },
    'battery': {'name': 'Аккумулятор', 'icon': battery_img},
}

export default function Body() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);

    return (
        <ReactFlowProvider>
            <Flow nodes={nodes} edges={edges} elements={elements} selectedNodes={selectedNodes}
                  setNodes={setNodes} setEdges={setEdges} setSelectedNodes={setSelectedNodes}/>
        </ReactFlowProvider>
    )
}

