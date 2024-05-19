import React, {memo, useState} from 'react';
import './ContextMenu.css';
import {
    CircuitNode,
    BulbNodeProps,
    NodeDataProps,
    NodeProps,
    NodeType,
    PowerSourceNodeProps,
    ResistorNodeProps,
    CapacitorNodeProps,
    DiodeNodeProps
} from "../../types.ts";
import {elements} from "../../defaults.ts";

import delete_icon from '../../../assets/Icons/delete_icon.png'
import {Form, InputGroup} from "react-bootstrap";


interface CircuitElementContextMenuProps<T> {
   id: CircuitNode<NodeProps>['id'];
   values: T;
   onValuesChange: NodeDataProps<T>['onDataChange'];
}


function ResistorContextMenu({id, values: {resistance}, onValuesChange}: CircuitElementContextMenuProps<ResistorNodeProps>) {
    return <InputGroup>
        <InputGroup.Text>Сопротивление</InputGroup.Text>
        <Form.Control className='resistance' aria-label="Resistance" type='number' defaultValue={resistance} step='0.1'
                      min='0' style={{width: 60}} onChange={(e) => onValuesChange ? onValuesChange(id, {resistance: Number(e.target.value)}) : null}/>
        <InputGroup.Text>Ом</InputGroup.Text>
      </InputGroup>;
}

function BulbContextMenu ({id, values: {power, voltage}, onValuesChange}: CircuitElementContextMenuProps<BulbNodeProps>) {
    return <>
        <InputGroup>
            <InputGroup.Text style={{width: '120px'}}>Мощность</InputGroup.Text>
            <Form.Control className='power' aria-label="Power" type='number' defaultValue={power} step='0.1'
                          min='0' style={{width: '72px'}} onChange={(e) => onValuesChange ? onValuesChange(id, {
                power: Number(e.target.value),
                voltage: voltage
            }) : null} />
            <InputGroup.Text style={{width: '40px'}}>Вт</InputGroup.Text>
        </InputGroup>
        <InputGroup>
            <InputGroup.Text style={{width: '120px'}}>Напряжение</InputGroup.Text>
            <Form.Control className='voltage' aria-label="Voltage" type='number' defaultValue={voltage} step='0.1'
                          min='0' style={{width: '72px'}} onChange={(e) => onValuesChange ? onValuesChange(id, {
                power: power,
                voltage: Number(e.target.value)
            }) : null}/>
            <InputGroup.Text style={{width: '40px'}}>В</InputGroup.Text>
        </InputGroup>
    </>;
}

function PowerSourceContextMenu({id, values: {voltage}, onValuesChange}: CircuitElementContextMenuProps<PowerSourceNodeProps>) {
    return <InputGroup>
        <InputGroup.Text>Мощность</InputGroup.Text>
        <Form.Control className='power' aria-label="Power" type='number' defaultValue={voltage} step='0.1'
                      min='0' style={{width: '72px'}} onChange={(e) => onValuesChange ? onValuesChange(id,
            {voltage: Number(e.target.value)}) : null}/>
        <InputGroup.Text>Вт</InputGroup.Text>
    </InputGroup>;
}

function CapacitorContextMenu({id, values: {capacitance}, onValuesChange}: CircuitElementContextMenuProps<CapacitorNodeProps>) {
    return <InputGroup>
        <InputGroup.Text>Конденсатор</InputGroup.Text>
        <Form.Control className='capacitance' aria-label="Capacitance" type='number' defaultValue={capacitance} step='0.1'
                      min='0' style={{width: 60}} onChange={(e) => onValuesChange ? onValuesChange(id, {capacitance: Number(e.target.value)}) : null}/>
        <InputGroup.Text>Ф</InputGroup.Text>
    </InputGroup>;
}

function DiodeContextMenu({id, values: {voltage, current, waveLength}, onValuesChange}: CircuitElementContextMenuProps<DiodeNodeProps>) {
    const [waveLengthValue, setWaveLengthValue] = useState<number>(waveLength);

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value_name: "voltage" | "current" | "waveLength") => {
        if (value_name === 'waveLength') {
            setWaveLengthValue(Number(event.target.value));
        }
        return onValuesChange(id, {
            current: value_name === 'current' ? Number(event.target.value) : current,
            voltage: value_name === 'voltage' ? Number(event.target.value) : voltage,
            waveLength: value_name === 'waveLength' ? Number(event.target.value) : waveLength,
        })
    }

    return <>
        <InputGroup>
        <InputGroup.Text>Напряжение</InputGroup.Text>
        <Form.Control className='voltage' aria-label="Voltage" type='number' defaultValue={voltage} step='0.1'
                      min='0' style={{width: 60}} onChange={(e) => handleValueChange(e, 'voltage')}/>
        <InputGroup.Text>В</InputGroup.Text>
        </InputGroup>
        <InputGroup>
        <InputGroup.Text>Рабочий ток</InputGroup.Text>
        <Form.Control className='current' aria-label="Current" type='number' defaultValue={voltage} step='0.1'
                      min='0' style={{width: 60}} onChange={(e) => handleValueChange(e, 'current')}/>
        <InputGroup.Text>А</InputGroup.Text>
        </InputGroup>
        <InputGroup>
        <InputGroup.Text>Длина волны</InputGroup.Text>
        <Form.Control className='waveLength' aria-label="WaveLength" type='number' value={waveLengthValue} step='1'
                      min='400' max='760' style={{width: 60}} onChange={(e) => handleValueChange(e, 'waveLength')}/>
        <InputGroup.Text>нМ</InputGroup.Text>
        </InputGroup>
        <input className='wave_length_slider' type='range' min={400} max={760} step={1}
               value={waveLengthValue} onChange={(e) => handleValueChange(e, 'waveLength')}/>
    </>;
}

export const CircuitElementContextMenu = memo(({ id, data: {values, onDataChange}, type}: CircuitNode<NodeProps>) => {
    let contextMenuComponent = null;

    if (type === NodeType.Resistor && 'resistance' in values) {
        contextMenuComponent = <ResistorContextMenu id={id} values={values} onValuesChange={onDataChange} />;
    } else if (type === NodeType.Bulb && 'power' in values && 'voltage' in values) {
        contextMenuComponent = <BulbContextMenu id={id} values={values} onValuesChange={onDataChange}/>;
    } else if (type === NodeType.PowerSource && 'voltage' in values) {
        contextMenuComponent = <PowerSourceContextMenu id={id} values={values} onValuesChange={onDataChange}/>;
    } else if ((type === NodeType.Capacitor || type === NodeType.PolarCapacitor) && 'capacitance' in values) {
        contextMenuComponent = <CapacitorContextMenu id={id} values={values} onValuesChange={onDataChange}/>;
    } else if (type === NodeType.Diode && 'voltage' in values && 'current' in values && 'waveLength' in values) {
        contextMenuComponent = <DiodeContextMenu id={id} values={values} onValuesChange={onDataChange}/>;
    }

    return contextMenuComponent;
});


interface ContextMenuProps {
    node: CircuitNode<NodeProps>,
    top?: number,
    left?: number,
    right?: number,
    bottom?: number,
    onClick: () => void,
    onNodeDelete: (NodeId: string) => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({
     node,
     top,
     left,
     right,
     bottom,
     onClick,
     onNodeDelete,
     ...props
     }) => {

     const handleDeleteClick = () => {
        onClick();
        onNodeDelete(node.id);
    };

    return (
        <div
            style={{top, left, right, bottom, width: 260}}
            className="context-menu"
            {...props}
        >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', userSelect: 'none'}}>
                <img src={elements[node.type as NodeType].icon} alt={node.type} style={{padding: '4px', width: '40px', height: '40px'}}/>
                <small>{elements[node.type as NodeType].name}</small>
                <img src={delete_icon} alt="delete" style={{padding: '8px', width: '40px', height: '40px'}} onClick={handleDeleteClick}/>
            </div>
            <CircuitElementContextMenu id={node.id} data={node.data} type={node.type} position={node.position}/>
        </div>
    );
}

export default ContextMenu;
