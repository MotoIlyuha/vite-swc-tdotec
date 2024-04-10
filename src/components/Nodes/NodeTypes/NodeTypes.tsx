import {Handle, Position, useUpdateNodeInternals, Node as ReactFlowNode } from 'reactflow';
import {useCallback, useState, memo} from 'react';
import './NodeStyles.css';

import resistor_img from '../../../assets/Images/resistor.svg';
import battery_img from '../../../assets/Images/battery.svg';
import bulb_off_img from '../../../assets/Images/bulb_off.svg';
import switch_off_img from '../../../assets/Images/switch_off.svg';
import switch_on_img from '../../../assets/Images/switch_on.svg';
import rotate_icon from '../../../assets/Icons/rotate_icon.png';


type NodeType = 'powerSource' | 'resistor' | 'bulb' | 'switch';

export interface BaseNodeData<T> extends ReactFlowNode {
    id: string;
    data: T;
    position: {
        x: number;
        y: number;
    }
    orientation: "hor" | "ver";
    type: NodeType;
    selected?: boolean;
}

export interface ResistorNodeProps {
    resistance: number;
}

export interface PowerSourceNodeProps {
    power: number;
}

export interface BulbNodeProps {
    brightness: number;
}

export interface SwitchNodeProps {
    switchState: boolean;
}

export type NodeProps = ResistorNodeProps | PowerSourceNodeProps | BulbNodeProps | SwitchNodeProps;


const circuit_icons = {
    'resistor': resistor_img,
    'battery': battery_img,
    'bulb': bulb_off_img,
    'switcher_on': switch_on_img,
    'switcher_off': switch_off_img
};

function ResistorFrame({resistance}: ResistorNodeProps) {
    return (
        <div>
            <img src={circuit_icons['resistor']} alt={resistance.toString()}/>
        </div>
    );
}

function BulbFrame({brightness}: BulbNodeProps) {

    function handleClick() {
        console.log(brightness);
    }

    return (
        <div style={{position: 'relative'}}>
            <div className='bulb_glow' style={{
                opacity: `${brightness === 0 ? 0 : 1}`,
                backgroundColor: `rgba(${155 + brightness}, ${155 + brightness}, 5, 1)`,
                boxShadow: `0 0 16px ${brightness / 6}px rgba(${155 + brightness}, ${155 + brightness}, 5, 0.5)`
            }}>
            </div>
            <img className='bulb_img' src={circuit_icons['bulb']} alt='Лампочка' onClick={handleClick}/>
        </div>
    );
}

function SwitchFrame({switchState}: SwitchNodeProps) {

    function handleClick() {
        switchState = !switchState;
    }

    return (
        <div>
            <img src={circuit_icons[switchState ? 'switcher_on' : 'switcher_off']} alt={'Переключатель'}/>
            <div className='switch_click_aria' onClick={handleClick}/>
        </div>
    );
}

function PowerSourceFrame({power}: PowerSourceNodeProps) {
    return (
        <div>
            <img src={circuit_icons['battery']} alt={power.toString()}/>
        </div>
    );
}

export const CircuitElementNode = memo(({
        id, data, type, selected, orientation
    }: BaseNodeData<NodeProps>) => {

    const [orient, setOrient] = useState(orientation);
    const updateNodeInternals = useUpdateNodeInternals();

    const rotateNode = useCallback(() => {
        console.log(id, orient);
        setOrient(orient === 'hor' ? 'ver' : 'hor');
        updateNodeInternals(id);
    },[id, orient, updateNodeInternals])

    return (
        <div id={id} className={`node ${type} ${orient} ${selected ? 'selected' : ''}`}
            style={{
                'width': `${orient === 'hor' ? 80 : 40}px`,
                'height': `${orient === 'hor' ? 40 : 80}px`,
                'position': 'relative'
        }}>
            <Handle type="source" position={orient === 'hor' ? Position.Left : Position.Top}/>
            <div style={{
                transform: `rotate(${orient === 'hor' ? 0 : 90}deg)`,
                width: `${orient === 'hor' ? 40 : 80}px`,
                height: `${orient === 'hor' ? 80 : 40}px`,
                position: 'absolute',
                top: `${orient === 'hor' ? 0 : 20}px`,
                left: `${orient === 'hor' ? 0 : -20}px`,
                }}>
            {type === 'resistor' && <ResistorFrame resistance={"resistance" in data ? data.resistance : 10}/>}
            {type === 'bulb' && <BulbFrame brightness={"brightness" in data ? data.brightness : 0}/>}
            {type === 'powerSource' && <PowerSourceFrame power={"power" in data ? data.power : 5}/>}
            {type === 'switch' && <SwitchFrame switchState={"switchState" in data ? data.switchState : false}/>}
            </div>
            <button className='rotate-button' onClick={rotateNode}
                    style={{ transform: `rotate(${orient === 'hor' ? 0 : 90}deg)`}}>
                <img src={rotate_icon} alt='перевернуть'/>
            </button>
            <Handle type="target" position={orient === 'hor' ? Position.Right : Position.Bottom}/>
        </div>
    );
});

export const ResistorNode = memo(
    ({ id, data: { resistance = 10 }, position, orientation }: BaseNodeData<ResistorNodeProps>) => {

    return <CircuitElementNode
        id={`resistor_${id}`} selected={false} data={{ resistance }} position={position} orientation={orientation} type={'resistor'}
    />;
});

export const SwitchNode = memo(
    ({id, data: {switchState = false}, position, orientation}: BaseNodeData<SwitchNodeProps>) => {
    return <CircuitElementNode
        id={`switch_${id}`} selected={false} data={{ switchState }} position={position} orientation={orientation} type={'switch'}
    />;
})

export const PowerSourceNode = memo(
    ({id, data: {power = 5}, position, orientation}: BaseNodeData<PowerSourceNodeProps>) => {
    return <CircuitElementNode
        id={`powerSource_${id}`} selected={false} data={{ power }} position={position} orientation={orientation} type={'powerSource'}
    />;
})

export const BulbNode = memo(
    ({id, data: {brightness = 0}, position, orientation}: BaseNodeData<BulbNodeProps>) => {
    return <CircuitElementNode
        id={`bulb_${id}`} selected={false} data={{ brightness }} position={position} orientation={orientation} type={'bulb'}
    />;
})
