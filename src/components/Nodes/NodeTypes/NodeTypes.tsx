import {Handle, Position, useUpdateNodeInternals, Node as ReactFlowNode } from 'reactflow';
import {useCallback, useState, memo} from 'react';
import './NodeStyles.css';

import resistor_img from '../../../assets/Images/resistor.svg';
import battery_img from '../../../assets/Images/battery.svg';
import bulb_on_img from '../../../assets/Images/bulb_on.svg';
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
    orientation?: "hor" | "ver";
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
    'bulb': bulb_on_img,
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
    return (
        <div>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                backgroundColor: `rgb(${2 * (brightness ?? 0)}, ${2 * (brightness ?? 0)}, ${0.5 * (brightness ?? 0)})`,
                boxShadow: `0 0 16px ${(brightness ?? 0) / 4}px rgba(${2 * (brightness ?? 0)}, ${2 * (brightness ?? 0)}, ${0.5 * (brightness ?? 0)}, 0.75)`
            }}>
            </div>
            <img src={circuit_icons['bulb']} alt='Лампочка' style={{position: 'absolute'}}/>
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
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '40px',
                    height: '20px',
                    marginTop: '-10px', // Сдвигаем вверх на половину высоты, чтобы центрировать
                    marginLeft: '-20px', // Сдвигаем влево на половину ширины, чтобы центрировать
                    backgroundColor: 'rgba(0, 0, 255, 0.2)', // Прозрачный синий фон для визуализации
                }}
                onClick={handleClick}
            />
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
        id, type, selected, data,
    }: BaseNodeData<NodeProps>) => {

    const [orientation, setOrientation] = useState('hor');
    const updateNodeInternals = useUpdateNodeInternals();

    const rotateNode = useCallback(() => {
        setOrientation(orientation === 'hor' ? 'ver' : 'hor');
        updateNodeInternals(id);
    },[id, orientation, updateNodeInternals])

    return (
        <div id={id} className={`node ${type} ${orientation} ${selected ? 'selected' : ''}`}
            style={{
                transform: `rotate(${orientation === 'hor' ? 0 : 90}deg)`,
            }}>
            <Handle type="source" position={Position.Left}/>
            {type === 'resistor' && <ResistorFrame resistance={"resistance" in data ? data.resistance ?? 10 : 10}/>}
            {type === 'bulb' && <BulbFrame brightness={"brightness" in data ? data.brightness ?? 0 : 0}/>}
            {type === 'powerSource' && <PowerSourceFrame power={"power" in data ? data.power ?? 5 : 5}/>}
            {type === 'switch' && <SwitchFrame switchState={"switchState" in data ? data.switchState ?? false : false}/>}
            <button className='rotate-button' onClick={rotateNode}
                    style={{
                        transform: `rotate(${orientation === 'hor' ? 0 : 90}deg)`,
                    }}>
                <img src={rotate_icon} alt='перевернуть'/>
            </button>
            <Handle type="target" position={Position.Right}/>
        </div>
    );
});

export const ResistorNode = memo(({ id, data: { resistance = 10 }, position }: BaseNodeData<ResistorNodeProps>) => {
    return <CircuitElementNode id={`resistor_${id}`} selected={false} data={{ resistance }} position={position} type={'resistor'} />;
});

export const SwitchNode = memo(({id, data: {switchState = false}, position, orientation }: BaseNodeData<SwitchNodeProps>) => {
    return <CircuitElementNode id={`switch_${id}`} selected={false} data={{
        switchState: switchState,
    }} position={position} orientation={orientation} type={'switch'} />;
});

export const PowerSourceNode = memo(({id, data: {power = 5}, position}: BaseNodeData<PowerSourceNodeProps>) => {
    return <CircuitElementNode id={`powerSource_${id}`} selected={false} data={{
        power: power,
    }} position={position} type={'powerSource'} />;
})

export const BulbNode = memo(({id, data: {brightness = 0}, position}: BaseNodeData<BulbNodeProps>) => {
    return <CircuitElementNode id={`bulb_${id}`} selected={false} data={{
        brightness: brightness,
    }} position={position} type={'bulb'} />;
})
