import {Handle, NodeProps, Position} from 'reactflow';
import './NodeStyles.css'
import {useState} from "react";

import resistor_img from '../../assets/Images/resistor.svg';
import battery_img from '../../assets/Images/battery.svg';
import lamb_off_img from '../../assets/Images/lamb_off.svg';
import lamb_on_img from '../../assets/Images/lamb_on.svg';
import switcher_off_img from '../../assets/Images/switch_off.svg';
import switcher_on_img from '../../assets/Images/switch_on.svg';


type NodeData = {
    orientation: 'hor' | 'ver';
    value: number;
};

export function ResistorNode({id, data, isConnectable}: NodeProps<NodeData>) {
    // const onChange = useCallback((evt: { target: { value: any; }; }) => {
    //     console.log(evt.target.value);
    // }, []);

    return <div id={id} className={'node resistor node-' + data.orientation}>
        <Handle type="target" position={Position.Right} isConnectable={isConnectable}/>
        <img src={resistor_img} alt=""/>
        <Handle type="source" position={Position.Left} isConnectable={isConnectable}/>
    </div>;
}


export function BatteryNode({id, data, isConnectable}: NodeProps<NodeData>) {
    // const onChange = useCallback((evt: { target: { value: any; }; }) => {
    //     console.log(evt.target.value);
    // }, []);

    return <div id={id} className={'node battery node-' + data.orientation}>
        <Handle type="target" position={Position.Left} isConnectable={isConnectable}/>
        <img src={battery_img} alt=""/>
        <Handle type="source" position={Position.Right} isConnectable={isConnectable}/>
    </div>;
}

export function LambNode({id, data, isConnectable}: NodeProps<NodeData>) {
    // const onChange = useCallback((evt: { target: { value: any; }; }) => {
    //     console.log(evt.target.value);
    // }, []);

    return <div id={id} className={'node lamb node-' + data.orientation}>
        <Handle type="target" position={Position.Right} isConnectable={isConnectable}/>
        <img src={data.value ? lamb_on_img : lamb_off_img} alt=""/>
        <Handle type="source" position={Position.Left} isConnectable={isConnectable}/>
    </div>;
}

export function SwitchNode({id, data, isConnectable}: NodeProps<NodeData>) {
    const [state, setState] = useState<boolean>(false);

    // const onChange = useCallback((evt: { target: { value: any; }; }) => {
    //     console.log(evt.target.value);
    // }, []);

    return <div id={id} className={'node switch node-' + data.orientation} onClick={() => setState(!state)}>
        <Handle type="target" position={Position.Right} isConnectable={isConnectable}/>
        <img src={state ? switcher_on_img : switcher_off_img} alt=""/>
        <Handle type="source" position={Position.Left} isConnectable={isConnectable}/>
    </div>;
}


