import {useState} from "react";
import {ReactFlowProvider, Node, Edge} from "reactflow";
import Flow from "../Field/Flow";
import './Field.css';

import {BaseNodeData} from '../Nodes/NodeTypes/NodeTypes.tsx';

import resistor_img from "../../assets/Icons/resistor_icon.svg";
import battery_img from "../../assets/Icons/battery_icon.svg";
import lamb_on_img from "../../assets/Icons/lamb_on_icon.svg";
import lamb_off_img from "../../assets/Icons/lamb_off_icon.svg";
import switcher_on_img from "../../assets/Icons/switcher_on_icon.svg";
import switcher_off_img from "../../assets/Icons/switcher_off_icon.svg";

const initialNodes: BaseNodeData[] = [
    {id: 'switch-1', data: {id: 'switch-1', values: {switchState: true}}, position: {x: 0, y: 0}, orientation: 'ver', type: 'switch'},
    {id: 'bulb-1', data: {id: 'bulb-1', values: {brightness: 10}}, position: {x: 100, y: 0}, orientation: 'hor', type: 'bulb'},
    {id: 'resistor-1', data: {orientation: 'hor', resistance: 10, showData: true}, position: {x: 200, y: 0}, type: 'resistor'},
    {id: 'powerSource-1', data: {orientation: 'hor', power: 10, showData: false}, position: {x: 300, y: 0}, type: 'powerSource'},
];

const initialEdges: Edge[] = [{id: 'e1-2', source: '1', target: '2', type: 'default'}];

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

