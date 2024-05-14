import {useEffect} from "react";
import {
    NodeType,
    CircuitElementType,
    CircuitNode,
    NodeProps,
    PowerSourceNodeProps,
    SwitchNodeProps,
    BulbNodeProps,
    ResistorNodeProps
} from "./types";


import resistor_img from "../assets/Icons/resistor_icon.svg";
import battery_img from "../assets/Icons/battery_icon.svg";
import lamb_on_img from "../assets/Icons/lamb_on_icon.svg";
import lamb_off_img from "../assets/Icons/lamb_off_icon.svg";
import switcher_on_img from "../assets/Icons/switcher_on_icon.svg";
import switcher_off_img from "../assets/Icons/switcher_off_icon.svg";
import {Edge} from "reactflow";

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
    bulb: {
        brightness: 0,
        power: 0.03,
        voltage: 1.5
    },
    resistor: {
        resistance: 3
    },
    powerSource: {
        power: 6
    },
    switch: {
        switchState: false
    }
}

export const DefaultByType = (type: NodeType) => {
    let defaultValues;

    switch (type) {
        case NodeType.PowerSource:
            defaultValues = DefaultValues.powerSource;
            break;
        case NodeType.Resistor:
            defaultValues = DefaultValues.resistor;
            break;
        case NodeType.Bulb:
            defaultValues = DefaultValues.bulb;
            break;
        case NodeType.Switch:
            defaultValues = DefaultValues.switch;
            break;
        default:
            throw new Error(`Invalid NodeType: ${type}`);
    }
    return defaultValues;
}

export const useInitialSetup = (
    setNodes: (nodes: CircuitNode<NodeProps>[]) => void,
    setEdges: (edges: Edge[]) => void,
    onChange: CircuitNode<NodeProps>['onChange']
) => {
    useEffect(() => {
        setNodes([
            {
                id: 'powerSource-1',
                data: DefaultByType(NodeType.PowerSource),
                onChange: (id, values, orientation, polar) => onChange(id, values as PowerSourceNodeProps, orientation, polar),
                position: {x: 140, y: -20},
                type: NodeType.PowerSource,
                orientation: 'hor',
                polar: 'pos',
            },
            {
                id: 'switch-1',
                data: DefaultByType(NodeType.Switch),
                onChange: (id, values, orientation, polar) => onChange(id, values as SwitchNodeProps, orientation, polar),
                position: {x: 240, y: 40},
                type: NodeType.Switch,
                orientation: 'ver',
            },
            {
                id: 'bulb-1',
                data: DefaultByType(NodeType.Bulb),
                onChange: (id, values, orientation, polar) => onChange(id, values as BulbNodeProps, orientation, polar),
                position: {x: 140, y: 140},
                type: NodeType.Bulb,
                orientation: 'hor',
            },
            {
                id: 'resistor-1',
                data: DefaultByType(NodeType.Resistor),
                onChange: (id, values, orientation, polar) => onChange(id, values as ResistorNodeProps, orientation, polar),
                position: {x: 80, y: 40},
                type: NodeType.Resistor,
                orientation: 'ver',
            },
        ]);

        setEdges([
            {id: 'wire_ps1-s1', source: 'switch-1', target: 'powerSource-1', type: 'smoothstep'},
            {id: 'wire_s1-b1', source: 'bulb-1', target: 'switch-1', type: 'smoothstep'},
            {id: 'wire_b1-r1', source: 'resistor-1', target: 'bulb-1', type: 'smoothstep'},
            {id: 'wire_r1-ps1', source: 'resistor-1', target: 'powerSource-1', type: 'smoothstep'},
        ]);
    }, [setNodes, setEdges, onChange]);
};

