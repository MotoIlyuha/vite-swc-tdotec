import { Node as ReactFlowNode } from 'reactflow';

export enum NodeType {
    PowerSource = 'powerSource',
    Resistor = 'resistor',
    Bulb = 'bulb',
    Switch = 'switch'
}

export type CircuitElementType = {
    [key in NodeType]: {
        name: string;
        icon: string;
        on_img?: string;
        off_img?: string;
    }
}

export interface NodeDataProps<T> {
    values: T;
    orientation: 'ver' | 'hor';
    selected?: boolean;
}

export interface BaseNodeData<T> extends ReactFlowNode {
    data: NodeDataProps<T>
    type: NodeType.PowerSource | NodeType.Resistor | NodeType.Bulb | NodeType.Switch;
}

export type NodeProps = ResistorNodeProps | PowerSourceNodeProps | BulbNodeProps | SwitchNodeProps;


export type ResistorNodeProps = {
    resistance?: number;
}

export type PowerSourceNodeProps = {
    power?: number;
}

export type BulbNodeProps = {
    brightness?: number;
}

export type SwitchNodeProps = {
    switchState?: boolean;
}
