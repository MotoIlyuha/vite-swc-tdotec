import {Handle, NodeToolbar, Position, useUpdateNodeInternals} from 'reactflow';
import {memo, useCallback, useState} from 'react';
import './NodeStyles.css';

import {
    BaseNodeData,
    BulbNodeProps,
    NodeProps,
    NodeType,
    PowerSourceNodeProps,
    ResistorNodeProps,
    SwitchNodeProps
} from "../../types.ts";
import {DefaultValues} from "../../defaults.ts";

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

function SwitchFrame({switchState = DefaultValues.switch.switchState}: SwitchNodeProps) {

    const [state, setState] = useState(switchState);

    return (
        <div>
            <div className='switch_click_aria' onClick={() => setState(!state)}/>
            <img src={circuit_icons[state ? 'switcher_on' : 'switcher_off']} alt={'Переключатель'}/>
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
    {id, data: {values, orientation}, type, selected}: BaseNodeData<NodeProps>
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
            {type === NodeType.Resistor && 'resistance' in values && 'resistance' in values && <div>Сопротивление: {values.resistance}Ом</div>}
            {type === NodeType.Bulb && 'power' in values && 'power' in values && <div>Мощность: {values.power}Вт</div>}
            {type === NodeType.Bulb && 'voltage' in values && 'voltage' in values && <div>Напряжение: {values.voltage}В</div>}
            {type === NodeType.PowerSource && 'power' in values && 'power' in values && <div>Мощность: {values.power}Вт</div>}
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
                {type === NodeType.Resistor && 'resistance' in values && <ResistorFrame resistance={values.resistance}/>}
                {type === NodeType.Bulb && 'brightness' in values && <BulbFrame brightness={values.brightness}/>}
                {type === NodeType.PowerSource && 'power' in values && <PowerSourceFrame power={values.power}/>}
                {type === NodeType.Switch && 'switchState' in values && <SwitchFrame switchState={values.switchState}/>}
            </div>
            <button className='rotate-button' onClick={rotateNode}
                    style={{transform: `rotate(${orient === 'hor' ? 0 : 90}deg)`}}>
                <img src={rotate_icon} alt='перевернуть'/>
            </button>
            <Handle id={id + '_target'} type="source" position={orient === 'hor' ? Position.Right : Position.Bottom}/>
        </div>
        </>
    );
});

export const ResistorNode = memo(
    ({
         id,
         data: {values: {resistance = DefaultValues.resistor.resistance}, orientation},
         position
     }: BaseNodeData<ResistorNodeProps>) => {

        return <CircuitElementNode
            id={id} selected={false} data={{values: {resistance}, orientation}} position={position}
            type={NodeType.Resistor}
        />;
    });

export const BulbNode = memo(
    ({
         id,
         data: {values: {brightness = DefaultValues.bulb.brightness}, orientation},
         position
     }: BaseNodeData<BulbNodeProps>) => {

        return <CircuitElementNode
            id={id} selected={false} data={{values: {brightness}, orientation}} position={position}
            type={NodeType.Bulb}
        />;
    }
)

export const PowerSourceNode = memo(
    ({
         id,
         data: {values: {power = DefaultValues.powerSource.power}, orientation},
         position
     }: BaseNodeData<PowerSourceNodeProps>) => {

        return <CircuitElementNode
            id={id} selected={false} data={{values: {power}, orientation}} position={position}
            type={NodeType.PowerSource}
        />;
    }
)

export const SwitchNode = memo(
    ({
         id,
         data: {values: {switchState = DefaultValues.switch.switchState}, orientation},
         position
     }: BaseNodeData<SwitchNodeProps>) => {

        return <CircuitElementNode
            id={id} selected={false} data={{values: {switchState}, orientation}} position={position}
            type={NodeType.Switch}
        />;
    }
)
