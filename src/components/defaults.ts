import {useEffect} from "react";
import {
    NodeType,
    CircuitElementType,
    BaseNodeData,
    NodeProps,
    NodeDataProps,
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

export const DefaultByType = (
    type: NodeType,
    orientation: NodeDataProps<NodeProps>["orientation"],
    onChange: NodeDataProps<NodeProps>["onValuesChange"]
) => {
    let defaultValues;
    let onValuesChange;

    switch (type) {
        case NodeType.PowerSource:
            defaultValues = DefaultValues.powerSource;
            onValuesChange = (id: string, power: PowerSourceNodeProps, orientation?: NodeDataProps<NodeProps>["orientation"]) => onChange(id, power, orientation);
            break;
        case NodeType.Resistor:
            defaultValues = DefaultValues.resistor;
            onValuesChange = (id: string, resistance: ResistorNodeProps, orientation?: NodeDataProps<NodeProps>["orientation"]) => onChange(id, resistance, orientation);
            break;
            case NodeType.Bulb:
            defaultValues = DefaultValues.bulb;
            onValuesChange = (id: string, props: BulbNodeProps, orientation?: NodeDataProps<NodeProps>["orientation"]) => onChange(id, props, orientation);
            break;
        case NodeType.Switch:
            defaultValues = DefaultValues.switch;
            onValuesChange = (id: string, switchState: SwitchNodeProps, orientation?: NodeDataProps<NodeProps>["orientation"]) => onChange(id, switchState, orientation);
            break;
        default:
            throw new Error(`Invalid NodeType: ${type}`);
    }
    return {
        values: defaultValues,
        orientation: orientation,
        onValuesChange: onValuesChange
    } as NodeDataProps<NodeProps>;
}

export const useInitialSetup = (
    setNodes: (nodes: BaseNodeData<NodeProps>[]) => void,
    setEdges: (edges: Edge[]) => void,
    onChange: (id: string, event: NodeDataProps<NodeProps>['values']) => void
) => {
    useEffect(() => {
        setNodes([
            {
                id: 'powerSource-1',
                data: DefaultByType(NodeType.PowerSource, 'hor', onChange),
                position: {x: 140, y: -20},
                type: NodeType.PowerSource
            },
            {
                id: 'switch-1',
                data: DefaultByType(NodeType.Switch, 'ver', onChange),
                position: {x: 240, y: 40},
                type: NodeType.Switch
            },
            {
                id: 'bulb-1',
                data: DefaultByType(NodeType.Bulb, 'hor', onChange),
                position: {x: 140, y: 140},
                type: NodeType.Bulb
            },
            {
                id: 'resistor-1',
                data: DefaultByType(NodeType.Resistor, 'ver', onChange),
                position: {x: 80, y: 40},
                type: NodeType.Resistor
            },
        ]);

        setEdges([
            {id: 'wire_ps1-s1', source: 'powerSource-1', target: 'switch-1', type: 'wire'},
            {id: 'wire_s1-b1', source: 'switch-1', target: 'bulb-1', type: 'wire'},
            {id: 'wire_b1-r1', source: 'bulb-1', target: 'resistor-1', type: 'wire'},
            {id: 'wire_r1-ps1', source: 'resistor-1', target: 'powerSource-1', type: 'wire'},
        ]);
    }, [setNodes, setEdges, onChange]);
};

