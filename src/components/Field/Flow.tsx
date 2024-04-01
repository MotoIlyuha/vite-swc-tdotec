import React, {useCallback, useRef, useState} from 'react';
import ReactFlow, {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    BackgroundVariant,
    ConnectionLineType,
    ConnectionMode,
    Controls,
    DefaultEdgeOptions,
    Edge,
    EdgeTypes,
    FitViewOptions,
    Node,
    NodeTypes,
    OnConnect,
    OnEdgesChange,
    OnNodesChange,
    ReactFlowInstance,
} from 'reactflow';

import 'reactflow/dist/style.css';

import {BatteryNode, LambNode, ResistorNode, SwitchNode} from '../Nodes/NodeTypes.tsx';
import DeletableEdge from '../Nodes/DeletableEdge';
import ContextMenu from "../Nodes/ContextMenu/ContextMenu.tsx";

const initialNodes: Node[] = [
    {id: '1', data: {orientation: 'hor'}, position: {x: 0, y: 0}, type: 'switcher'},
    {id: '2', data: {orientation: 'hor'}, position: {x: 0, y: 100}, type: 'resistor'},
    {id: '3', data: {orientation: 'hor'}, position: {x: 0, y: 200}, type: 'battery'},
    {id: '3', data: {orientation: 'hor'}, position: {x: 0, y: 300}, type: 'lamb'},
];

const initialEdges: Edge[] = [{id: 'e1-2', source: '1', target: '2', type: 'default'}];

const fitViewOptions: FitViewOptions = {
    padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: false,
};

const nodeTypes: NodeTypes = {
    resistor: ResistorNode,
    battery: BatteryNode,
    lamb: LambNode,
    switcher: SwitchNode,
};

const edgeTypes: EdgeTypes = {
    deletable: DeletableEdge,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

function Flow() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [menu, setMenu] = useState<{
        id: string;
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
    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance?.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            if (!position) return; // Добавлено условие для обработки случая, когда position не определено

            const newNode = {
                id: getId(),
                type,
                position,
                data: {label: `${type} node`},
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

            setMenu({
                id: node.id,
                top: event.clientY < pane.height - 200 ? event.clientY : undefined,
                left: event.clientX < pane.width - 200 ? event.clientX : undefined,
                right: event.clientX >= pane.width - 200 ? pane.width - event.clientX : undefined,
                bottom: event.clientY >= pane.height - 200 ? pane.height - event.clientY : undefined,
            });
        },
        [setMenu],
    );

    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

    return (
        <ReactFlow
            ref={ref}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
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
            style={{
                position: 'absolute',
            }}
        >
            {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
            <Controls/>
            <Background
                id="1"
                gap={20}
                color="#ccc"
                variant={BackgroundVariant.Lines}
            />
            <Background
                id="2"
                gap={100}
                color="#777"
                variant={BackgroundVariant.Lines}
            />
        </ReactFlow>
    );
}

export default Flow;
