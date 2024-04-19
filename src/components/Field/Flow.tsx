import React, {useCallback, useMemo, useRef, useState} from 'react';
import ReactFlow, {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    useOnSelectionChange,
    Background,
    Controls,
    Panel,
    BackgroundVariant,
    ConnectionLineType,
    ConnectionMode,
    DefaultEdgeOptions,
    Edge,
    EdgeTypes,
    FitViewOptions,
    Node,
    NodeTypes,
    OnEdgesChange,
    OnNodesChange,
    ReactFlowInstance,
    Connection, OnSelectionChangeParams,
} from 'reactflow';

import 'reactflow/dist/style.css';

import {
    ResistorNode,
    PowerSourceNode,
    BulbNode,
    SwitchNode
} from '../Nodes/NodeTypes/NodeTypes';
import WireEdge from '../Nodes/EdgeTypes/WireEdge.tsx';
import ContextMenu from "../Nodes/ContextMenu/ContextMenu.tsx";
import AddElementMenu from "./AddElementMenu.tsx";
import ElementsManager from "./ElementsManager.tsx";
import {BaseNodeData, CircuitElementType, NodeDataProps, NodeProps, NodeType} from "../types";
import {DefaultByType} from "../defaults.ts";
import SimulationPanel from "../Simulation/SimulationPanel.tsx";


const fitViewOptions: FitViewOptions = {
    padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: false,
};

const nodeTypes: NodeTypes = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resistor: ResistorNode,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    powerSource: PowerSourceNode,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    bulb: BulbNode,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    switch: SwitchNode
};

const edgeTypes: EdgeTypes = {
    wire: WireEdge
};

let id = 0;
const getId = (type: NodeType) => `${type}_${id++}`;

interface FlowProps {
    nodes: Node[];
    edges: Edge[];
    elements: CircuitElementType;
    setNodes: (nodes: (nds: Node[]) => Node[]) => void;
    setEdges: (edges: (eds: Edge[]) => Edge[]) => void;
}

function Flow({nodes, edges, elements, setNodes, setEdges}: FlowProps) {
    const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [menu, setMenu] = useState<{
        node: BaseNodeData<NodeProps>;
        top?: number;
        left?: number;
        right?: number;
        bottom?: number;
    } | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes],
    );
    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges],
    );

    const onConnect = useCallback(
        (params: Connection) =>
            setEdges((eds) =>
                addEdge({...params, type: 'wire'}, eds)
            ),
        [setEdges]
    );

    const onNodeDelete = useCallback(
        (nodeId: string) => {
            setNodes((nds) => nds.filter((node: Node) => node.id !== nodeId));
            setEdges((eds) => eds.filter((edge: Edge) => edge.source !== nodeId && edge.target !== nodeId));
        },
        [setNodes, setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type: string = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance?.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            if (!position) return; // Добавлено условие для обработки случая, когда position не определено

            const newNode: BaseNodeData<NodeProps> = {
                id: getId(type as NodeType),
                data: DefaultByType(type as NodeType) as NodeDataProps<NodeProps>,
                position,
                type: type as NodeType,
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes],
    );

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: Node) => {
            event.preventDefault();

            const pane = ref.current?.getBoundingClientRect();
            if (!pane) {
                console.log('Pane not found');
                return;
            }

            setSelectedNodes([node]);

            setMenu({
                node: node as BaseNodeData<NodeProps>,
                top: event.clientY < pane.height - 50 ? event.clientY : undefined,
                left: event.clientX < pane.width - 50 ? event.clientX : undefined,
                right: event.clientX >= pane.width - 50 ? pane.width - event.clientX : undefined,
                bottom: event.clientY >= pane.height - 50 ? pane.height - event.clientY : undefined,
            });
        },
        [setMenu, setSelectedNodes],
    );

    const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
            setSelectedNodes(params.nodes);
        }, [setSelectedNodes]
    );

    const selectableNodes = useMemo(() => nodes.map(node => ({
        ...node,
        className: selectedNodes.includes(node) ? 'selected' : ''
    })), [nodes, selectedNodes]);

    const onPaneClick = useCallback(() => {
        setMenu(null);
        setSelectedNodes([]);
    }, [setMenu, setSelectedNodes]);

    useOnSelectionChange({
        onChange: ({nodes}) => {
            setSelectedNodes(nodes);
        },
    });

    return (
        <ReactFlow
            ref={ref}
            nodes={selectableNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onSelectionChange={onSelectionChange}
            onConnect={onConnect}
            fitView
            fitViewOptions={fitViewOptions}
            defaultEdgeOptions={defaultEdgeOptions}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            connectionLineType={ConnectionLineType.Step}
            connectionMode={ConnectionMode.Loose}
            onInit={setReactFlowInstance}
            onPaneClick={onPaneClick}
            onNodeContextMenu={onNodeContextMenu}
            onDrop={onDrop}
            onDragOver={onDragOver}
            snapToGrid={true}
            snapGrid={[20, 20]}
        >
            {menu && <ContextMenu onClick={onPaneClick} onNodeDelete={onNodeDelete} {...menu} />}

            <Panel position='top-left'>
                <ElementsManager nodes={nodes as BaseNodeData<NodeProps>[]} elements={elements}
                                 selectedNodes={selectedNodes as BaseNodeData<NodeProps>[]}
                                 setSelectedNodes={setSelectedNodes} onNodeDelete={onNodeDelete}/>
            </Panel>

            <Panel position='bottom-left'>
                <AddElementMenu elements={elements}/>
            </Panel>

            <Panel position='bottom-right'>
                <SimulationPanel nodes={nodes as BaseNodeData<NodeProps>[]} edges={edges} />
            </Panel>

            <Controls position='top-right'/>
            <Background
                id="1"
                gap={20}
                color="#ddd"
                variant={BackgroundVariant.Lines}
            />
            <Background
                id="2"
                gap={100}
                color="#aaa"
                variant={BackgroundVariant.Lines}
            />
        </ReactFlow>
    );
}

export default Flow;
