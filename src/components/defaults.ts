import {useEffect} from "react";
import {
    BulbNodeProps,
    CircuitElementType,
    CircuitNode,
    NodeProps,
    NodeType,
    PowerSourceNodeProps,
    ResistorNodeProps,
    SwitchNodeProps
} from "./types";


import resistor_img from "../assets/Icons/resistor_icon.svg";
import battery_img from "../assets/Icons/battery_icon.svg";
import lamb_off_img from "../assets/Icons/lamb_off_icon.svg";
import switcher_off_img from "../assets/Icons/switcher_off_icon.svg";
import capacitor_img from "../assets/Icons/capacitor_icon.svg";
import polar_capacitor_img from "../assets/Icons/polar_capacitor_icon.svg";
import diode_img from "../assets/Icons/diode_icon.svg"
import ammeter_img from "../assets/Icons/ammeter_icon.svg"
import ohmmeter_img from "../assets/Icons/ohmmeter_icon.svg"
import voltmeter_img from "../assets/Icons/voltmeter_icon.svg"
import galvanometer_img from "../assets/Icons/galvanometer_icon.svg"
import {Edge} from "reactflow";

export const elements: CircuitElementType = {
    resistor: {
        'name': 'Резистор',
        'icon': resistor_img
    },
    bulb: {
        'name': 'Лампа',
        'icon': lamb_off_img,
    },
    switch: {
        'name': 'Переключатель',
        'icon': switcher_off_img,
    },
    powerSource: {
        'name': 'Аккумулятор',
        'icon': battery_img,
    },
    capacitor: {
        'name': 'Конденсатор',
        'icon': capacitor_img,
    },
    polarCapacitor: {
        'name': 'Полярный конденсатор',
        'icon': polar_capacitor_img
    },
    diode: {
        'name': 'Светодиод',
        'icon': diode_img
    },
    voltmeter: {
        'name': 'Вольтметр',
        'icon': voltmeter_img
    },
    ammeter: {
        'name': 'Амперметр',
        'icon': ammeter_img
    },
    ohmmeter: {
        'name': 'Омметр',
        'icon': ohmmeter_img
    },
    galvanometer: {
        'name': 'Гальванометр',
        'icon': galvanometer_img
    }
}

export const DefaultValues = {
    bulb: {
        power: 0.03,
        voltage: 1.5
    },
    resistor: {
        resistance: 3
    },
    powerSource: {
        voltage: 6
    },
    capacitor: {
        capacitance: 1
    },
    polarCapacitor: {
        capacitance: 1
    },
    diode: {
        waveLength: 530,
        voltage: 2,
        current: 0.02
    },
    switch: {
        switchState: false
    },
    ammeter: {
        current: 0
    },
    voltmeter: {
        voltage: 0
    },
    ohmmeter: {
        resistance: 0
    },
    galvanometer: {
        voltage: 0,
        current: 0,
        resistance: 0
    }
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
                    values: DefaultValues.powerSource,
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
                    values: DefaultValues.switch,
                    orientation: 'ver',
                    onDataChange: (id, values, orientation, polar) => onChange(id, values as SwitchNodeProps, orientation, polar)
                },
                position: {x: 240, y: 40},
                type: NodeType.Switch
            },
            {
                id: 'bulb-1',
                data: {
                    values: DefaultValues.bulb,
                    orientation: 'hor',
                    onDataChange: (id, values, orientation, polar) => onChange(id, values as BulbNodeProps, orientation, polar)
                },
                position: {x: 140, y: 140},
                type: NodeType.Bulb
            },
            {
                id: 'resistor-1',
                data: {
                    values: DefaultValues.resistor,
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

