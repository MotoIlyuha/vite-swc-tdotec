import {useState} from "react";
import {Edge, Node, ReactFlowProvider} from "reactflow";
import Flow from "../Field/Flow";
import './Field.css';
import {elements, initialEdges, initialNodes} from "../defaults.ts";


export default function Body() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    return (
        <ReactFlowProvider>
            <Flow nodes={nodes as Node[]} edges={edges} elements={elements}
                  setNodes={setNodes} setEdges={setEdges}/>
        </ReactFlowProvider>
    )
}

