import {Handle, NodeProps, Position} from 'reactflow';
import './NodeStyles.css'
import {useState} from "react";

import resitor_img from './Images/resistor.svg';
import battery_img from './Images/battery.svg';
import lamb_off_img from './Images/lamb_off.svg';
import lamb_on_img from './Images/lamb_on.svg';
import switcher_off_img from './Images/switch_off.svg';
import switcher_on_img from './Images/switch_on.svg';


type NodeData = {
    orientation: 'hor' | 'ver';
    value: number;
};

export function ResistorNode({id, data, isConnectable}: NodeProps<NodeData>) {
    // const onChange = useCallback((evt: { target: { value: any; }; }) => {
    //     console.log(evt.target.value);
    // }, []);

    return <div id={id} className={'resistor node-' + data.orientation}>
        <Handle type="target" position={Position.Right} isConnectable={isConnectable}/>
        <svg width="80" height="40">
            <g>
                <rect id="svg_1" height="16.528922" width="52.892551" y="11.735539" x="13.553722" stroke-width="1.5"
                      stroke="#000" fill="#fff"/>
                <line stroke="#000" id="svg_3" y2="20"
                      x2="68" y1="20" x1="80" stroke-width="1.5" fill="none"/>
                <line stroke="#000" id="svg_4" y2="20" x2="0.75"
                      y1="20" x1="12" stroke-width="1.5" fill="none"/>
            </g>
        </svg>
        <Handle type="source" position={Position.Left} isConnectable={isConnectable}/>
    </div>;
}


export function BatteryNode({id, data, isConnectable}: NodeProps<NodeData>) {
    // const onChange = useCallback((evt: { target: { value: any; }; }) => {
    //     console.log(evt.target.value);
    // }, []);

    return <div id={id} className={'battery node-' + data.orientation}>
        <Handle type="target" position={Position.Left} isConnectable={isConnectable}/>
        <img src={battery_img} alt=""/>
        <Handle type="source" position={Position.Right} isConnectable={isConnectable}/>
    </div>;
}

export function LambNode({id, data, isConnectable}: NodeProps<NodeData>) {
    // const onChange = useCallback((evt: { target: { value: any; }; }) => {
    //     console.log(evt.target.value);
    // }, []);

    return <div id={id} className={'lamb node-' + data.orientation}>
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

    return <div id={id} className={'switch node-' + data.orientation} onClick={() => setState(!state)}>
        <Handle type="target" position={Position.Right} isConnectable={isConnectable}/>
        <img src={state ? switcher_on_img : switcher_off_img} alt=""/>
        <Handle type="source" position={Position.Left} isConnectable={isConnectable}/>
    </div>;
}


