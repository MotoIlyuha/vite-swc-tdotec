import {Handle, NodeToolbar, Position, useUpdateNodeInternals} from 'reactflow';
import {memo, useCallback} from 'react';
import './NodeStyles.css';

import {
    CircuitNode,
    BulbNodeProps,
    NodeProps,
    NodeType,
    PowerSourceNodeProps,
    ResistorNodeProps,
    SwitchNodeProps
} from "../../types";
import {DefaultValues} from "../../defaults";

import resistor_img from '../../../assets/Images/resistor.svg';
import battery_img from '../../../assets/Images/battery.svg';
import bulb_off_img from '../../../assets/Images/bulb_off.svg';
import switch_off_img from '../../../assets/Images/switch_off.svg';
import switch_on_img from '../../../assets/Images/switch_on.svg';
import rotate_icon from '../../../assets/Icons/rotate_icon.png';


const circuit_icons = {
    'resistor': resistor_img,
    'battery': battery_img,
    'bulb': bulb_off_img,
    'switcher_on': switch_on_img,
    'switcher_off': switch_off_img
};

function ResistorFrame({resistance = DefaultValues.resistor.resistance}: ResistorNodeProps) {
    return (
        <div>
            <img src={circuit_icons['resistor']} alt={resistance.toString()}/>
        </div>
    );
}

function BulbFrame({brightness = DefaultValues.bulb.brightness}: BulbNodeProps) {

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

interface SwitchFrameProps {
    id: CircuitNode<SwitchNodeProps>['id'];
    onSwitchChange: CircuitNode<SwitchNodeProps>['onChange'];
    switchState: SwitchNodeProps['switchState'];
}

function SwitchFrame({id, onSwitchChange, switchState}: SwitchFrameProps) {
    return (
        <div>
            <div className='switch_click_aria' onClick={() => onSwitchChange(id, {switchState: !switchState})}
                 style={{cursor: 'pointer'}}/>
            <img src={circuit_icons[switchState ? 'switcher_on' : 'switcher_off']} alt={'Переключатель'}/>
        </div>
    );
}

function PowerSourceFrame({power = DefaultValues.powerSource.power}: PowerSourceNodeProps) {
    return (
        <div>
            <img src={circuit_icons['battery']} alt={power.toString()}/>
        </div>
    );
}

// interface CircuitElementNodeProps<T> {
//     id: CircuitNode<T>['id'];
//     data: CircuitNode<T>['data'];
//     orientation: CircuitNode<T>['orientation'];
//     type: CircuitNode<T>['type'];
//     selected: CircuitNode<T>['selected'];
// }

export const CircuitElementNode = memo((
    {id, data, onChange, orientation, type, selected}: CircuitNode<NodeProps>
) => {

    const updateNodeInternals = useUpdateNodeInternals();

    const rotateNode = useCallback(() => {
        onChange(id, data, orientation === 'ver' ? 'hor' : 'ver');
        updateNodeInternals(id);
    }, [id, onChange, orientation, updateNodeInternals, data])

    return (
        <>
            <NodeToolbar isVisible={true} position={orientation === 'hor' ? Position.Top : Position.Left}>
                {type === NodeType.Resistor && 'resistance' in data &&
                    <div>Сопротивление: {data.resistance}Ом</div>}
                {type === NodeType.Bulb && 'power' in data &&
                    <div>Мощность: {data.power}Вт</div>}
                {type === NodeType.Bulb && 'voltage' in data &&
                    <div>Напряжение: {data.voltage}В</div>}
                {type === NodeType.PowerSource && 'power' in data &&
                    <div>Мощность: {data.power}Вт</div>}
            </NodeToolbar>
            <div id={id} className={`node ${type} ${orientation} ${selected ? 'selected' : ''}`}
                 style={{
                     'width': `${orientation === 'hor' ? 80 : 40}px`,
                     'height': `${orientation === 'hor' ? 40 : 80}px`,
                     'position': 'relative'
                 }}>
                <Handle id={id + '_source'} type="source" position={orientation === 'hor' ? Position.Left : Position.Top}/>
                <div style={{
                    transform: `rotate(${orientation === 'hor' ? 0 : 90}deg)`
                }}>
                    {type === NodeType.Resistor && 'resistance' in data &&
                        <ResistorFrame resistance={data.resistance}/>}
                    {type === NodeType.Bulb && 'power' in data && 'voltage' in data &&
                        <BulbFrame brightness={data.brightness} power={data.power} voltage={data.voltage}/>}
                    {type === NodeType.PowerSource && 'power' in data &&
                        <PowerSourceFrame power={data.power}/>}
                    {type === NodeType.Switch && 'switchState' in data &&
                        <SwitchFrame id={id} onSwitchChange={onChange} switchState={data.switchState}/>}
                </div>
                <button className='rotate-button' onClick={rotateNode}
                        style={{transform: `rotate(${orientation === 'hor' ? 0 : 90}deg)`}}>
                    <img src={rotate_icon} alt='перевернуть'/>
                </button>
                <Handle id={id + '_target'} type="source"
                        position={orientation === 'hor' ? Position.Right : Position.Bottom}/>
            </div>
        </>
    );
});

export const ResistorNode = memo(
    ({id, data, orientation, onChange, position, selected}: CircuitNode<ResistorNodeProps>) => {
        return <CircuitElementNode
            id={id}
            data={data}
            onChange={() => onChange(id, data, orientation)}
            orientation={orientation}
            type={NodeType.Resistor}
            selected={selected}
            position={position}
        />;
    }
);

export const BulbNode = memo(
    ({id, data, orientation, onChange, position, selected}: CircuitNode<BulbNodeProps>) => {
        return <CircuitElementNode
            id={id}
            data={data}
            onChange={() => onChange(id, data, orientation)}
            orientation={orientation}
            type={NodeType.Bulb}
            selected={selected}
            position={position}
        />;
    }
)

export const PowerSourceNode = memo(
    ({id, data, orientation, onChange, position, selected}: CircuitNode<PowerSourceNodeProps>) => {
        return <CircuitElementNode
            id={id}
            data={data}
            onChange={() => onChange(id, data, orientation)}
            orientation={orientation}
            type={NodeType.PowerSource}
            selected={selected}
            position={position}
        />;
    }
)

export const SwitchNode = memo(
    ({id, data, orientation, onChange, position, selected}: CircuitNode<SwitchNodeProps>) => {
        return <CircuitElementNode
            id={id}
            data={data}
            onChange={() => onChange(id, data, orientation)}
            orientation={orientation}
            type={NodeType.Switch}
            selected={selected}
            position={position}
        />;
    }
)
