import React from 'react';
import './ContextMenu.css';
import {
    BaseNodeData,
    BulbNodeProps,
    NodeProps,
    PowerSourceNodeProps,
    ResistorNodeProps,
    SwitchNodeProps
} from "../../types.ts";
import {DefaultValues, elements} from "../../defaults.ts";

import delete_icon from '../../../assets/Icons/delete_icon.png'
import {ButtonGroup, Form, InputGroup} from "react-bootstrap";
import ToggleButton from "react-bootstrap/ToggleButton";


function ResistorContextMenu({resistance = DefaultValues.resistor.resistance}: ResistorNodeProps) {
    return <InputGroup>
        <InputGroup.Text>Сопротивление</InputGroup.Text>
        <Form.Control className='resistance' aria-label="Resistance" type='number' defaultValue={resistance} step='0.1'
                      min='0' style={{width: '72px'}}/>
        <InputGroup.Text>Ом</InputGroup.Text>
      </InputGroup>;
}

function BulbContextMenu({
    power = DefaultValues.bulb.power,
    voltage = DefaultValues.bulb.voltage
}: BulbNodeProps) {
    return <>
        <InputGroup>
            <InputGroup.Text style={{width: '120px'}}>Мощность</InputGroup.Text>
            <Form.Control className='power' aria-label="Power" type='number' defaultValue={power} step='0.1'
                          min='0' style={{width: '72px'}}/>
            <InputGroup.Text style={{width: '40px'}}>Вт</InputGroup.Text>
        </InputGroup>
        <InputGroup>
            <InputGroup.Text style={{width: '120px'}}>Напряжение</InputGroup.Text>
            <Form.Control className='voltage' aria-label="Voltage" type='number' defaultValue={voltage} step='0.1'
                          min='0' style={{width: '72px'}}/>
            <InputGroup.Text style={{width: '40px'}}>В</InputGroup.Text>
        </InputGroup>
    </>;
}

function PowerSourceContextMenu({power = DefaultValues.powerSource.power}: PowerSourceNodeProps) {
    return <InputGroup>
        <InputGroup.Text>Мощность</InputGroup.Text>
        <Form.Control className='power' aria-label="Power" type='number' defaultValue={power} step='0.1'
                      min='0' style={{width: '72px'}}/>
        <InputGroup.Text>Вт</InputGroup.Text>
    </InputGroup>;
}

function SwitcherContextMenu({switchState = DefaultValues.switch.switchState}: SwitchNodeProps) {
    return <ButtonGroup>
        <ToggleButton id={'text'} value={0} type="radio" disabled variant="secondary">Состояние</ToggleButton>
        <ToggleButton id={'on'} value={1} checked={switchState} type="radio" variant="success">Вкл</ToggleButton>
        <ToggleButton id={'off'} value={0} checked={!switchState} type="radio" variant="danger">Выкл</ToggleButton>
    </ButtonGroup>;
}

export function CircuitElementContextMenu({ data: {values}, type }: BaseNodeData<NodeProps>) {
    return <>
        {type === 'resistor' && 'resistance' in values && <ResistorContextMenu resistance={values.resistance}/>}
        {type === 'bulb' && 'brightness' in values && <BulbContextMenu power={values.power} voltage={values.voltage}/>}
        {type === 'powerSource' && 'power' in values && <PowerSourceContextMenu power={values.power}/>}
        {type === 'switch' && 'switchState' in values && <SwitcherContextMenu switchState={values.switchState}/>}
    </>
}


interface ContextMenuProps {
    node: BaseNodeData<NodeProps>,
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
            style={{top, left, right, bottom}}
            className="context-menu"
            {...props}
        >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', userSelect: 'none'}}>
                <img src={elements[node.type].icon} alt={node.type} style={{padding: '4px', width: '40px', height: '40px'}}/>
                <small>{elements[node.type].name}</small>
                <img src={delete_icon} alt="delete" style={{padding: '8px', width: '40px', height: '40px'}} onClick={handleDeleteClick}/>
            </div>
            <CircuitElementContextMenu id={node.id} data={node.data} type={node.type} position={node.position}/>
        </div>
    );
}

export default ContextMenu;
