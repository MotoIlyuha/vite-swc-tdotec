import {Handle, NodeProps, Position, useUpdateNodeInternals } from 'reactflow';
import {useCallback, useState, memo} from 'react';
import './NodeStyles.css';

import resistor_img from '../../../assets/Images/resistor.svg';
import battery_img from '../../../assets/Images/battery.svg';
import bulb_on_img from '../../../assets/Images/bulb_on.svg';
import switch_off_img from '../../../assets/Images/switch_off.svg';
import switch_on_img from '../../../assets/Images/switch_on.svg';
import rotate_icon from '../../../assets/Icons/rotate_icon.png';


// type NodeType = 'powerSource' | 'resistor' | 'bulb' | 'switch';

interface BaseNodeData {
    values: {
        switchState?: boolean;
        brightness?: number;
        resistance?: number;
        power?: number;
    };
    orientation: "hor" | "ver";
}

export interface ResistorNodeData {
    resistance: number;
}

export interface PowerSourceNodeData {
    power: number;
}

export interface BulbNodeData {
    brightness: number;
}

export interface SwitchNodeData {
    switchState: boolean;
}

const circuit_icons = {
    'resistor': resistor_img,
    'battery': battery_img,
    'bulb': bulb_on_img,
    'switcher_on': switch_on_img,
    'switcher_off': switch_off_img
};

function ResistorFrame({resistance}: ResistorNodeData) {
    return (
        <div>
            <img src={circuit_icons['resistor']} alt={resistance.toString()}/>
        </div>
    );
}

function BulbFrame({brightness}: BulbNodeData) {
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

function SwitchFrame({switchState}: SwitchNodeData) {

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

function PowerSourceFrame({power}: PowerSourceNodeData) {
    return (
        <div>
            <img src={circuit_icons['battery']} alt={power.toString()}/>
        </div>
    );
}

export const CircuitElementNode = memo(({
        id, type, selected,
        data: {
        values: {resistance, brightness, power, switchState}
    }}: NodeProps<BaseNodeData>) => {

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
            {type === 'resistor' && <ResistorFrame resistance={resistance ?? 10}/>}
            {type === 'bulb' && <BulbFrame brightness={brightness ?? 0}/>}
            {type === 'powerSource' && <PowerSourceFrame power={power ?? 5}/>}
            {type === 'switch' && <SwitchFrame switchState={switchState ?? false}/>}
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

