import React, {useCallback, useRef, useState} from 'react';
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
    OnConnect,
    OnEdgesChange,
    OnNodesChange,
    ReactFlowInstance,
} from 'reactflow';

import 'reactflow/dist/style.css';

import {PowerSourceNode} from '../Nodes/NodeTypes/PowerSourceNode';
import {BulbNode} from "../Nodes/NodeTypes/BulbNode";
import {ResistorNode} from "../Nodes/NodeTypes/ResistorNode";
import {SwitchNode} from "../Nodes/NodeTypes/SwitchNode";

import DeletableEdge from '../Nodes/DeletableEdge';
import ContextMenu from "../Nodes/ContextMenu/ContextMenu.tsx";
import AddElementMenu from "./AddElementMenu.tsx";
import ElementsManager from "./ElementsManager.tsx";
import Button from "react-bootstrap/Button";

const fitViewOptions: FitViewOptions = {
    padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: false,
};

const nodeTypes: NodeTypes = {
    resistor: ResistorNode,
    powerSource: PowerSourceNode,
    bulb: BulbNode,
    switch: SwitchNode
};

const edgeTypes: EdgeTypes = {
    deletable: DeletableEdge,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

interface FlowProps {
    nodes: Node[];
    edges: Edge[];
    selectedNodes: Node[];
    elements: Record<string, Record<string, string>>;
    setNodes: (nodes: (nds: Node[]) => Node[]) => void;
    setEdges: (edges: (eds: Edge[]) => Edge[]) => void;
    setSelectedNodes: (selectedNodes: Node[]) => void;
}

function Flow({nodes, edges, selectedNodes, elements, setNodes, setEdges, setSelectedNodes}: FlowProps) {
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

    const onNodeDelete = useCallback(
        (nodeId: string) => {
            setNodes((nds) => nds.filter((node: Node) => node.id !== nodeId));
            setEdges((eds) => eds.filter((edge: Edge) => edge.source !== nodeId && edge.target !== nodeId));
        },
        [setNodes, setEdges],
    );

    const selectNodes = (nodes: Node[]) => {
        setSelectedNodes(nodes);
        nodes.map(node => {
            node.selected = selectedNodes.includes(node);
            node.className = selectedNodes.includes(node) ? 'selected' : 'notselected';
        }
        );
    }

    const onNodeClick = (_event: React.MouseEvent, node: Node) => {
        selectNodes([node]);
    }

    useOnSelectionChange({
        onChange: ({nodes}) => {
            selectNodes(nodes);
        },
    });

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
                top: event.clientY < pane.height - 50 ? event.clientY : undefined,
                left: event.clientX < pane.width - 50 ? event.clientX : undefined,
                right: event.clientX >= pane.width - 50 ? pane.width - event.clientX : undefined,
                bottom: event.clientY >= pane.height - 50 ? pane.height - event.clientY : undefined,
            });
        },
        [setMenu],
    );

    const onPaneClick = useCallback(() => {
        setMenu(null);
        setSelectedNodes([]);
    }, [setMenu, setSelectedNodes]);

    return (
        <ReactFlow
            ref={ref}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
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
                <ElementsManager nodes={nodes} elements={elements} selectNodes={selectNodes}
                                 onNodeDelete={onNodeDelete}/>
            </Panel>

            <Panel position='bottom-left'>
                <AddElementMenu elements={elements}/>
            </Panel>

            <Panel position='bottom-right'>
                <Button onClick={() => console.log(reactFlowInstance)}>Запустить</Button>
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
