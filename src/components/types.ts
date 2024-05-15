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
    orientation?: 'ver' | 'hor';
    polar?: 'pos' | 'neg';
    onDataChange: (
        id: CircuitNode<T>['id'],
        values?: T,
        orientation?: NodeDataProps<T>['orientation'],
        polar?: NodeDataProps<T>['polar']
    ) => void;
    selected?: boolean;
    errored?: boolean;
}

export interface CircuitNode<T> extends ReactFlowNode {
    data: NodeDataProps<T>
    type: string;
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
