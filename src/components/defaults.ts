import {Edge} from "reactflow";
import {NodeType, CircuitElementType, BaseNodeData, NodeProps, NodeDataProps} from "./types.ts";


import resistor_img from "../assets/Icons/resistor_icon.svg";
import battery_img from "../assets/Icons/battery_icon.svg";
import lamb_on_img from "../assets/Icons/lamb_on_icon.svg";
import lamb_off_img from "../assets/Icons/lamb_off_icon.svg";
import switcher_on_img from "../assets/Icons/switcher_on_icon.svg";
import switcher_off_img from "../assets/Icons/switcher_off_icon.svg";

export const elements: CircuitElementType = {
    resistor: {
        'name': 'Резистор',
        'icon': resistor_img
    },
    bulb: {
        'name': 'Лампа',
        'icon': lamb_off_img,
        'on_img': lamb_on_img,
        'off_img': lamb_off_img,
    },
    switch: {
        'name': 'Переключатель',
        'icon': switcher_off_img,
        'on_img': switcher_on_img,
        'off_img': switcher_off_img
    },
    powerSource: {
        'name': 'Аккумулятор',
        'icon': battery_img,
    },
}

export const DefaultValues = {
    resistance: 10,
    power: 10,
    brightness: 0,
    switchState: false
}

export const DefaultByType = (type: NodeType, orientation: 'hor' | 'ver' = 'hor') => {
    switch (type) {
        case NodeType.PowerSource: return {values: {power: DefaultValues.power}, orientation: orientation, selected: false};
        case NodeType.Resistor: return {values: {resistance: DefaultValues.resistance}, orientation: orientation, selected: false};
        case NodeType.Bulb: return {values: {brightness: DefaultValues.brightness}, orientation: orientation, selected: false};
        case NodeType.Switch: return {values: {switchState: DefaultValues.switchState}, orientation: orientation, selected: false};
    }
}

export const initialNodes: BaseNodeData<NodeProps>[] = [
    {id: 'powerSource-1', data: DefaultByType(NodeType.PowerSource, 'hor') as NodeDataProps<NodeProps>, position: {x: 140, y: 0}, type: NodeType.PowerSource},
    {id: 'switch-1', data: DefaultByType(NodeType.Switch, 'ver') as NodeDataProps<NodeProps>, position: {x: 220, y: 40}, type: NodeType.Switch},
    {id: 'bulb-1', data: DefaultByType(NodeType.Bulb, 'hor') as NodeDataProps<NodeProps>, position: {x: 140, y: 120}, type: NodeType.Bulb},
    {id: 'resistor-1', data: DefaultByType(NodeType.Resistor, 'ver') as NodeDataProps<NodeProps>, position: {x: 100, y: 40}, type: NodeType.Resistor},
];

export const initialEdges: Edge[] = [
    {id: 'wire_ps1-s1', source: 'powerSource-1', target: 'switch-1', type: 'wire'},
    {id: 'wire_s1-b1', source: 'switch-1', target: 'bulb-1', type: 'wire'},
    {id: 'wire_b1-r1', source: 'bulb-1', target: 'resistor-1', type: 'wire'},
    {id: 'wire_r1-ps1', source: 'resistor-1', target: 'powerSource-1', type: 'wire'},
];

