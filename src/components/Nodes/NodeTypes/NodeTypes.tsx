import {Handle, NodeToolbar, Position, useUpdateNodeInternals} from 'reactflow';
import {memo, useCallback, useState} from 'react';
import './NodeStyles.css';

import {
    BaseNodeData,
    BulbNodeProps, NodeDataProps,
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
    id: BaseNodeData<SwitchNodeProps>['id'];
    onSwitchChange: NodeDataProps<SwitchNodeProps>['onValuesChange'];
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

interface CircuitElementNodeProps<T> {
    id: BaseNodeData<T>['id'];
    data: {
        values: T;
        orientation: 'hor' | 'ver';
        onSwitchChange?: NodeDataProps<SwitchNodeProps>['onValuesChange'];
    };
    type: BaseNodeData<T>['type'];
    selected: BaseNodeData<T>['selected'];
}

export const CircuitElementNode = memo((
    {id, data: {values, orientation, onSwitchChange}, type, selected}: CircuitElementNodeProps<NodeProps>
) => {

    const [orient, setOrient] = useState(orientation);
    const updateNodeInternals = useUpdateNodeInternals();

    const rotateNode = useCallback(() => {
        setOrient(orient === 'hor' ? 'ver' : 'hor');
        updateNodeInternals(id);
    }, [id, orient, updateNodeInternals])

    return (
        <>
            <NodeToolbar isVisible={true} position={orient === 'hor' ? Position.Top : Position.Left}>
                {type === NodeType.Resistor && 'resistance' in values &&
                    <div>Сопротивление: {values.resistance}Ом</div>}
                {type === NodeType.Bulb && 'power' in values &&
                    <div>Мощность: {values.power}Вт</div>}
                {type === NodeType.Bulb && 'voltage' in values &&
                    <div>Напряжение: {values.voltage}В</div>}
                {type === NodeType.PowerSource && 'power' in values &&
                    <div>Мощность: {values.power}Вт</div>}
            </NodeToolbar>
            <div id={id} className={`node ${type} ${orient} ${selected ? 'selected' : ''}`}
                 style={{
                     'width': `${orient === 'hor' ? 80 : 40}px`,
                     'height': `${orient === 'hor' ? 40 : 80}px`,
                     'position': 'relative'
                 }}>
                <Handle id={id + '_source'} type="source" position={orient === 'hor' ? Position.Left : Position.Top}/>
                <div style={{
                    transform: `rotate(${orient === 'hor' ? 0 : 90}deg)`
                }}>
                    {type === NodeType.Resistor && 'resistance' in values &&
                        <ResistorFrame resistance={values.resistance}/>}
                    {type === NodeType.Bulb && 'power' in values && 'voltage' in values &&
                        <BulbFrame brightness={values.brightness} power={values.power} voltage={values.voltage}/>}
                    {type === NodeType.PowerSource && 'power' in values &&
                        <PowerSourceFrame power={values.power}/>}
                    {type === NodeType.Switch && 'switchState' in values && onSwitchChange &&
                        <SwitchFrame id={id} onSwitchChange={onSwitchChange} switchState={values.switchState}/>}
                </div>
                <button className='rotate-button' onClick={rotateNode}
                        style={{transform: `rotate(${orient === 'hor' ? 0 : 90}deg)`}}>
                    <img src={rotate_icon} alt='перевернуть'/>
                </button>
                <Handle id={id + '_target'} type="source"
                        position={orient === 'hor' ? Position.Right : Position.Bottom}/>
            </div>
        </>
    );
});

export const ResistorNode = memo(
    ({id, data, selected}: CircuitElementNodeProps<ResistorNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.Resistor}
            data={{
                values: {resistance: data.values.resistance},
                orientation: data.orientation
            }}
        />;
    }
);

export const BulbNode = memo(
    ({id, data, selected}: CircuitElementNodeProps<BulbNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.Bulb}
            data={{
                values: {power: data.values.power, voltage: data.values.voltage},
                orientation: data.orientation
            }}
        />;
    }
)

export const PowerSourceNode = memo(
    ({id, data, selected}: CircuitElementNodeProps<PowerSourceNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.PowerSource}
            data={{
                values: {power: data.values.power},
                orientation: data.orientation
            }}
        />;
    }
)

export const SwitchNode = memo(
    ({id, data, selected}: CircuitElementNodeProps<SwitchNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.Switch}
            data={{
                values: {switchState: data.values.switchState},
                orientation: data.orientation,
                onSwitchChange: () => {
                    data.onSwitchChange;
                    console.log(id, data.onSwitchChange);
                }
            }}
        />;
    }
)
