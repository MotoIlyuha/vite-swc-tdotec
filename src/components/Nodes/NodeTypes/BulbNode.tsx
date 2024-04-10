import {NodeProps} from "reactflow";
import {memo} from "react";
import {CircuitElementNode, BulbNodeData} from "./NodeTypes.tsx";


export const BulbNode = memo(({id, data: {brightness = 0}, xPos, yPos}: NodeProps<BulbNodeData>) => {
    return <CircuitElementNode id={`resistor_${id}`} dragging={false} selected={false} type={'resistor'} zIndex={0} data={{
        values: {
            switchState: undefined,
            brightness: brightness,
            resistance: undefined,
            power: undefined
        },
        orientation: 'hor'
    }} isConnectable={true} xPos={xPos} yPos={yPos}/>;
});