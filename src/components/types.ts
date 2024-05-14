import {Node as ReactFlowNode} from 'reactflow';

export enum NodeType {
    PowerSource = 'powerSource',
    Resistor = 'resistor',
    Bulb = 'bulb',
    Switch = 'switch'
}

export enum SimulationState {
    running = 'running',
    stopped = 'stopped',
    errored = 'errored'
}

export type CircuitElementType = {
    [key in NodeType]: {
        icon: string;
        name: string;
        off_img?: string;
        on_img?: string;
    }
}

export interface CircuitNode<T> extends ReactFlowNode {
    id: string;
    data: T,
    type: NodeType.PowerSource | NodeType.Resistor | NodeType.Bulb | NodeType.Switch;
    orientation?: 'ver' | 'hor';
    polar?: 'pos' | 'neg';
    selected?: boolean;
    errored?: boolean;
    onChange: (
        id: CircuitNode<NodeProps>['id'],
        data?: CircuitNode<T>['data'],
        orientation?: CircuitNode<NodeProps>['orientation'],
        polar?: CircuitNode<NodeProps>['polar']
    ) => void;
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
