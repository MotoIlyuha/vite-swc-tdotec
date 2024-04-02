import {ReactFlowProvider} from "reactflow";
import Flow from "../Field/Flow";
import './Field.css'

export default function Body() {

    return (
        <ReactFlowProvider>
            <Flow/>
        </ReactFlowProvider>
    )
}

