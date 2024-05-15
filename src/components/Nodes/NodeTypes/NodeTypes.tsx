import {Handle, NodeToolbar, Position, useUpdateNodeInternals} from 'reactflow';
import {memo, useCallback} from 'react';
import './NodeStyles.css';

import {
    BulbNodeProps,
    CircuitNode,
    NodeDataProps,
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
import reflect_icon from '../../../assets/Icons/reflect_icon.png';


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
    onSwitchChange: NodeDataProps<SwitchNodeProps>['onDataChange'];
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

export const CircuitElementNode = memo((
    {id, data: {values, orientation, polar, onDataChange}, type, selected}: CircuitNode<NodeProps>
) => {

    const updateNodeInternals = useUpdateNodeInternals();

    const rotateNode = useCallback(() => {
        onDataChange(id, values, orientation === 'hor' ? 'ver' : 'hor');
        updateNodeInternals(id);
    }, [id, onDataChange, orientation, updateNodeInternals, values])

    const reflectNode = useCallback(() => {
        onDataChange(id, values, orientation, polar === 'pos' ? 'neg' : 'pos');
        updateNodeInternals(id);
    }, [id, onDataChange, orientation, polar, updateNodeInternals, values])

    return <>
        <NodeToolbar isVisible={true} position={orientation === 'hor' ? Position.Top : Position.Left}>
            {type === NodeType.Resistor && 'resistance' in values &&
                <div>Сопротивление: {values.resistance}Ом</div>}
            {type === NodeType.Bulb && 'power' in values &&
                <div>Мощность: {values.power}Вт</div>}
            {type === NodeType.Bulb && 'voltage' in values &&
                <div>Напряжение: {values.voltage}В</div>}
            {type === NodeType.PowerSource && 'power' in values &&
                <div>Мощность: {values.power}Вт</div>}
        </NodeToolbar>
        <div id={id} className={`node ${type} ${orientation} ${selected ? 'selected' : ''}`}
             style={{
                 'width': `${orientation === 'hor' ? 80 : 40}px`,
                 'height': `${orientation === 'hor' ? 40 : 80}px`,
                 'position': 'relative'
             }}>
            <Handle id={id + '_source'} type="source" position={orientation === 'hor' ? Position.Left : Position.Top}/>
            <div style={{
                transform: `
                    rotate(${orientation === 'hor' ? 0 : 90}deg)
                    scaleX(${polar === 'pos' ? 1 : -1})
                    translateX(${(orientation === 'ver' || !orientation && polar === 'neg') ? -40 : 0}px)
                 `,
            }}>
                {type === NodeType.Resistor && 'resistance' in values &&
                    <ResistorFrame resistance={values.resistance}/>}
                {type === NodeType.Bulb && 'power' in values && 'voltage' in values &&
                    <BulbFrame brightness={values.brightness} power={values.power} voltage={values.voltage}/>}
                {type === NodeType.PowerSource && 'power' in values &&
                    <PowerSourceFrame power={values.power}/>}
                {type === NodeType.Switch && 'switchState' in values && onDataChange &&
                    <SwitchFrame id={id} onSwitchChange={onDataChange} switchState={values.switchState}/>}
            </div>
            <button className='rotate-button' onClick={rotateNode}
                    style={{transform: `rotate(${orientation === 'hor' ? 0 : 90}deg)`}}>
                <img src={rotate_icon} alt='перевернуть'/>
            </button>
            {polar && <button className='reflect-button' onClick={reflectNode}
                              style={{transform: `rotate(${orientation === 'hor' ? 0 : 90}deg)`}}>
                <img src={reflect_icon} alt='отразить'/>
            </button>}
            <Handle id={id + '_target'} type="source"
                    position={orientation === 'hor' ? Position.Right : Position.Bottom}/>
        </div>
    </>;
});

export const ResistorNode = memo(
    ({id, data, position, selected}: CircuitNode<ResistorNodeProps>) => {

        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.Resistor}
            position={position}
            data={{
                values: {resistance: data.values.resistance},
                orientation: data.orientation,
                onDataChange: (
                    id: CircuitNode<ResistorNodeProps>['id'],
                    values?: NodeProps,
                    orientation?: CircuitNode<ResistorNodeProps>['data']['orientation']
                ) => data.onDataChange(id, values as ResistorNodeProps, orientation)
            }}
        />;
    }
);

export const BulbNode = memo(
    ({id, data, position, selected}: CircuitNode<BulbNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.Bulb}
            position={position}
            data={{
                values: {power: data.values.power, voltage: data.values.voltage, brightness: data.values.brightness},
                orientation: data.orientation,
                onDataChange: (
                    id: CircuitNode<BulbNodeProps>['id'],
                    values?: NodeProps,
                    orientation?: CircuitNode<BulbNodeProps>['data']['orientation']
                ) => data.onDataChange(id, values as BulbNodeProps, orientation)
            }}
        />;
    }
)

export const PowerSourceNode = memo(
    ({id, data, position, selected}: CircuitNode<PowerSourceNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.PowerSource}
            position={position}
            data={{
                values: {power: data.values.power},
                orientation: data.orientation,
                polar: data.polar,
                onDataChange: (
                    id: CircuitNode<PowerSourceNodeProps>['id'],
                    values?: NodeProps,
                    orientation?: CircuitNode<PowerSourceNodeProps>['data']['orientation'],
                    polar?: CircuitNode<PowerSourceNodeProps>['data']['polar']
                ) => data.onDataChange(id, values as PowerSourceNodeProps, orientation, polar)
            }}
        />;
    }
)

export const SwitchNode = memo(
    ({id, data, position, selected}: CircuitNode<SwitchNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.Switch}
            position={position}
            data={{
                values: {switchState: data.values.switchState},
                orientation: data.orientation,
                onDataChange: (
                    id: CircuitNode<SwitchNodeProps>['id'],
                    values?: NodeProps,
                    orientation?: CircuitNode<SwitchNodeProps>['data']['orientation']
                ) => data.onDataChange(id, values as SwitchNodeProps, orientation)
            }}
        />;
    }
)
