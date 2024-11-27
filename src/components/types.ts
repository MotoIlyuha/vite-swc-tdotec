import {Node as ReactFlowNode} from 'reactflow';

export type theme = 'light' | 'dark' | 'light_blueprint' | 'dark_blueprint';

export enum NodeType {
    PowerSource = 'powerSource',
    Resistor = 'resistor',
    Bulb = 'bulb',
    Switch = 'switch',
    Capacitor = 'capacitor',
    PolarCapacitor = 'polarCapacitor',
    Diode = 'diode',
    Ammeter = 'ammeter',
    Voltmeter = 'voltmeter',
    Ohmmeter = 'ohmmeter',
    Galvanometer = 'galvanometer',
}

export type CircuitElementType = {
    [key in NodeType]: {
        name: string;
        icon: string;
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

export type NodeProps = ResistorNodeProps | PowerSourceNodeProps | BulbNodeProps | SwitchNodeProps | CapacitorNodeProps | DiodeNodeProps | AmmeterNodeProps | VoltmeterNodeProps | OhmmeterNodeProps | GalvanometerNodeProps;

export type ResistorNodeProps = {
    resistance: number
}

export type PowerSourceNodeProps = {
    voltage: number;
}

export type BulbNodeProps = {
    power: number;
    voltage: number;
}

export type SwitchNodeProps = {
    switchState: boolean,
}

export type CapacitorNodeProps = {
    capacitance: number;
}

export type DiodeNodeProps = {
    voltage: number;
    current: number;
    waveLength: number;
}

export type AmmeterNodeProps = {
    current: number;
}

export type VoltmeterNodeProps = {
    voltage: number;
}

export type OhmmeterNodeProps = {
    resistance: number;
}

export type GalvanometerNodeProps = {
    voltage: number;
    current: number;
    resistance: number;
}

export enum ErrorType {None, NoPowerSource, EmptyCircuit, ExtraElements, CircuitNotClosed}
