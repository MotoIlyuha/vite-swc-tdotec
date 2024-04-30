import React, {memo, useState} from 'react';
import './ContextMenu.css';
import {
    BaseNodeData,
    BulbNodeProps,
    NodeDataProps,
    NodeProps,
    NodeType,
    PowerSourceNodeProps,
    ResistorNodeProps,
    SwitchNodeProps
} from "../../types.ts";
import {elements} from "../../defaults.ts";

import delete_icon from '../../../assets/Icons/delete_icon.png'
import {ButtonGroup, Form, InputGroup} from "react-bootstrap";
import ToggleButton from "react-bootstrap/ToggleButton";


interface CircuitElementContextMenuProps<T> {
   id: BaseNodeData<NodeProps>['id'];
   values: T;
   onValuesChange: NodeDataProps<T>['onValuesChange'];
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
                voltage: voltage,
                brightness: 0
            }) : null} />
            <InputGroup.Text style={{width: '40px'}}>Вт</InputGroup.Text>
        </InputGroup>
        <InputGroup>
            <InputGroup.Text style={{width: '120px'}}>Напряжение</InputGroup.Text>
            <Form.Control className='voltage' aria-label="Voltage" type='number' defaultValue={voltage} step='0.1'
                          min='0' style={{width: '72px'}} onChange={(e) => onValuesChange ? onValuesChange(id, {
                power: power,
                voltage: Number(e.target.value),
                brightness: 0
            }) : null}/>
            <InputGroup.Text style={{width: '40px'}}>В</InputGroup.Text>
        </InputGroup>
    </>;
}

function PowerSourceContextMenu({id, values: {power}, onValuesChange}: CircuitElementContextMenuProps<PowerSourceNodeProps>) {
    return <InputGroup>
        <InputGroup.Text>Мощность</InputGroup.Text>
        <Form.Control className='power' aria-label="Power" type='number' defaultValue={power} step='0.1'
                      min='0' style={{width: '72px'}} onChange={(e) => onValuesChange ? onValuesChange(id,
            {power: Number(e.target.value)}) : null}/>
        <InputGroup.Text>Вт</InputGroup.Text>
    </InputGroup>;
}

function SwitchContextMenu({id, values: {switchState}, onValuesChange}: CircuitElementContextMenuProps<SwitchNodeProps>) {
    const [checked, setChecked] = useState(switchState);

    return <ButtonGroup>
        <ToggleButton id={'text'} value={-1} type="radio" disabled variant="secondary">Состояние</ToggleButton>
        <ToggleButton id={'on'} value={1} checked={checked} type="checkbox" variant="outline-success"
                      onChange={() => {
                          onValuesChange ? onValuesChange(id, {switchState: true}) : null
                          setChecked(true)
                      }}>Вкл</ToggleButton>
        <ToggleButton id={'off'} value={0} checked={!checked} type="checkbox" variant="outline-danger"
                      onChange={() => {
                          onValuesChange ? onValuesChange(id, {switchState: false}) : null
                          setChecked(false)
                      }}>Выкл</ToggleButton>
    </ButtonGroup>;
}

export const CircuitElementContextMenu = memo(({ id, data: {values, onValuesChange}, type}: BaseNodeData<NodeProps>) => {
    let contextMenuComponent = null;

    if (type === NodeType.Resistor && 'resistance' in values) {
        contextMenuComponent = <ResistorContextMenu id={id} values={values} onValuesChange={onValuesChange} />;
    } else if (type === NodeType.Bulb && 'power' in values && 'voltage' in values) {
        contextMenuComponent = <BulbContextMenu id={id} values={values} onValuesChange={onValuesChange}/>;
    } else if (type === NodeType.PowerSource && 'power' in values) {
        contextMenuComponent = <PowerSourceContextMenu id={id} values={values} onValuesChange={onValuesChange}/>;
    } else if (type === NodeType.Switch && 'switchState' in values) {
        contextMenuComponent = <SwitchContextMenu id={id} values={values} onValuesChange={onValuesChange}/>;
    }

    return contextMenuComponent;
});


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
