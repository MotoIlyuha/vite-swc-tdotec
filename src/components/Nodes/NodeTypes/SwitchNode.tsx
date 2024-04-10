import {NodeProps} from "reactflow";
import {memo} from "react";
import {CircuitElementNode, SwitchNodeData} from "./NodeTypes.tsx";

export const SwitchNode = memo(({id, data: {switchState = false}, xPos, yPos}: NodeProps<SwitchNodeData>) => {
    return <CircuitElementNode id={`resistor_${id}`} dragging={false} selected={false} type={'resistor'} zIndex={0} data={{
        values: {
            switchState: switchState,
            brightness: undefined,
            resistance: undefined,
            power: undefined
        },
        orientation: 'hor'
    }} isConnectable={true} xPos={xPos} yPos={yPos}/>;
});