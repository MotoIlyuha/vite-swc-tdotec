import {Handle, Position, useUpdateNodeInternals} from 'reactflow';
import {useCallback, useState, memo} from 'react';
import './NodeStyles.css';

import {
    BaseNodeData,
    NodeType,
    NodeProps,
    ResistorNodeProps,
    BulbNodeProps,
    SwitchNodeProps,
    PowerSourceNodeProps
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

function ResistorFrame({resistance = DefaultValues.resistance}: ResistorNodeProps) {
    return (
        <div>
            <img src={circuit_icons['resistor']} alt={resistance.toString()}/>
        </div>
    );
}

function BulbFrame({brightness = DefaultValues.brightness}: BulbNodeProps) {

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

function SwitchFrame({switchState = DefaultValues.switchState}: SwitchNodeProps) {

    const [state, setState] = useState(switchState);

    return (
        <div>
            <div className='switch_click_aria' onClick={() => setState(!state)}/>
            <img src={circuit_icons[state ? 'switcher_on' : 'switcher_off']} alt={'Переключатель'}/>
        </div>
    );
}

function PowerSourceFrame({power = DefaultValues.power}: PowerSourceNodeProps) {
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
                {type === 'resistor' && 'resistance' in values && <ResistorFrame resistance={values.resistance}/>}
                {type === 'bulb' && 'brightness' in values && <BulbFrame brightness={values.brightness}/>}
                {type === 'powerSource' && 'power' in values && <PowerSourceFrame power={values.power}/>}
                {type === 'switch' && 'switchState' in values && <SwitchFrame switchState={values.switchState}/>}
            </div>
            <button className='rotate-button' onClick={rotateNode}
                    style={{transform: `rotate(${orient === 'hor' ? 0 : 90}deg)`}}>
                <img src={rotate_icon} alt='перевернуть'/>
            </button>
            <Handle type="target" position={orient === 'hor' ? Position.Right : Position.Bottom}/>
        </div>
    );
});

export const ResistorNode = memo(
    ({
         id,
         data: {values: {resistance = DefaultValues.resistance}, orientation},
         position
     }: BaseNodeData<ResistorNodeProps>) => {

        return <CircuitElementNode
            id={`resistor_${id}`} selected={false} data={{values: {resistance}, orientation}} position={position}
            type={NodeType.Resistor}
        />;
    });

export const BulbNode = memo(
    ({
         id,
         data: {values: {brightness = DefaultValues.brightness}, orientation},
         position
     }: BaseNodeData<BulbNodeProps>) => {

        return <CircuitElementNode
            id={`bulb_${id}`} selected={false} data={{values: {brightness}, orientation}} position={position}
            type={NodeType.Bulb}
        />;
    }
)

export const PowerSourceNode = memo(
    ({
         id,
         data: {values: {power = DefaultValues.power}, orientation},
         position
     }: BaseNodeData<PowerSourceNodeProps>) => {

        return <CircuitElementNode
            id={`powerSource_${id}`} selected={false} data={{values: {power}, orientation}} position={position}
            type={NodeType.PowerSource}
        />;
    }
)

export const SwitchNode = memo(
    ({
         id,
         data: {values: {switchState = DefaultValues.switchState}, orientation},
         position
     }: BaseNodeData<SwitchNodeProps>) => {

        return <CircuitElementNode
            id={`switch_${id}`} selected={false} data={{values: {switchState}, orientation}} position={position}
            type={NodeType.Switch}
        />;
    }
)
