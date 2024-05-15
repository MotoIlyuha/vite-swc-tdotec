import {useEffect} from "react";
import {
    NodeType,
    CircuitElementType,
    CircuitNode,
    NodeProps,
    PowerSourceNodeProps,
    SwitchNodeProps, BulbNodeProps, ResistorNodeProps
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

// TODO: Реализовать функцию генерации id

export const DefaultByType = (
    type: NodeType
) => {
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
    onChange: CircuitNode<NodeProps>['data']['onDataChange']
) => {
    useEffect(() => {
        setNodes([
            {
                id: 'powerSource-1',
                data: {
                    values: DefaultByType(NodeType.PowerSource),
                    orientation: 'hor',
                    polar: 'pos',
                    onDataChange: (id, values, orientation, polar) => onChange(id, values as PowerSourceNodeProps, orientation, polar)
                },
                position: {x: 140, y: -20},
                type: NodeType.PowerSource
            },
            {
                id: 'switch-1',
                data: {
                    values: DefaultByType(NodeType.Switch),
                    orientation: 'ver',
                    onDataChange: (id, values, orientation, polar) => onChange(id, values as SwitchNodeProps, orientation, polar)
                },
                position: {x: 240, y: 40},
                type: NodeType.Switch
            },
            {
                id: 'bulb-1',
                data: {
                    values: DefaultByType(NodeType.Bulb),
                    orientation: 'hor',
                    onDataChange: (id, values, orientation, polar) => onChange(id, values as BulbNodeProps, orientation, polar)
                },
                position: {x: 140, y: 140},
                type: NodeType.Bulb
            },
            {
                id: 'resistor-1',
                data: {
                    values: DefaultByType(NodeType.Resistor),
                    orientation: 'ver',
                    onDataChange: (id, values, orientation, polar) => onChange(id, values as ResistorNodeProps, orientation, polar)
                },
                position: {x: 80, y: 40},
                type: NodeType.Resistor
            },
        ]);

        setEdges([
            {id: 'wire_ps1-s1', source: 'powerSource-1', target: 'switch-1', sourceHandle: 'powerSource-1_target', targetHandle: 'switch-1_source', type: 'wire'},
            {id: 'wire_s1-b1', source: 'switch-1', target: 'bulb-1', sourceHandle: 'switch-1_target', targetHandle: 'bulb-1_target', type: 'wire'},
            {id: 'wire_b1-r1', source: 'bulb-1', target: 'resistor-1', sourceHandle: 'bulb-1_source', targetHandle: 'resistor-1_target', type: 'wire'},
            {id: 'wire_r1-ps1', source: 'resistor-1', target: 'powerSource-1', sourceHandle: 'resistor-1_source', targetHandle: 'powerSource-1_source', type: 'wire'},
        ]);
    }, [setNodes, setEdges, onChange]);
};

