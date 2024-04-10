import {NodeProps} from "reactflow";
import {memo} from "react";
import {CircuitElementNode, ResistorNodeData} from "./NodeTypes.tsx";


export const ResistorNode = memo(({id, data: {resistance = 10}, xPos, yPos}: NodeProps<ResistorNodeData>) => {
    return <CircuitElementNode id={`resistor_${id}`} dragging={false} selected={false} type={'resistor'} zIndex={0} data={{
        values: {
            switchState: undefined,
            brightness: undefined,
            resistance: resistance,
            power: undefined
        },
        orientation: 'hor'
    }} isConnectable={true} xPos={xPos} yPos={yPos}/>;
});