import {NodeProps} from "reactflow";
import {memo} from "react";
import {CircuitElementNode, PowerSourceNodeData} from "./NodeTypes.tsx";


export const PowerSourceNode = memo(({id, data: {power = 5}, xPos, yPos}: NodeProps<PowerSourceNodeData>) => {
    return <CircuitElementNode id={`resistor_${id}`} dragging={false} selected={false} type={'resistor'} zIndex={0} data={{
        values: {
            switchState: undefined,
            brightness: undefined,
            resistance: undefined,
            power: power
        },
        orientation: 'hor'
    }} isConnectable={true} xPos={xPos} yPos={yPos}/>;
});