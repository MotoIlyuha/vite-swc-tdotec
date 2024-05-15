import {Node as ReactFlowNode} from 'reactflow';

export enum NodeType {
    PowerSource = 'powerSource',
    Resistor = 'resistor',
    Bulb = 'bulb',
    Switch = 'switch'
}

export type CircuitElementType = {
    [key in NodeType]: {
        icon: string;
        name: string;
        off_img?: string;
        on_img?: string;
    }
}

export interface NodeDataProps<T> {
    values: T;
    onValuesChange: (id: BaseNodeData<T>['id'], values: NodeDataProps<T>['values']) => void;
    orientation: 'ver' | 'hor';
    selected?: boolean;
}

export interface BaseNodeData<T> extends ReactFlowNode {
    data: NodeDataProps<T>
    type: NodeType.PowerSource | NodeType.Resistor | NodeType.Bulb | NodeType.Switch;
}

export type NodeProps = ResistorNodeProps | PowerSourceNodeProps | BulbNodeProps | SwitchNodeProps;


export type ResistorNodeProps = {
    resistance: number
}

export type PowerSourceNodeProps = {
    power: number;
}

export type BulbNodeProps = {
    brightness: number;
    power: number;
    voltage: number;
}

export type SwitchNodeProps = {
    switchState: boolean,
}

export type CircuitErrorsType = {
    name: string;
    proposal_solution: string;
    button_text: string;
    solution_func: () => void;
}
