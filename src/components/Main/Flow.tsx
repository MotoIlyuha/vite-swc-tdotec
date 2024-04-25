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
import {BaseNodeData, NodeDataProps, NodeProps, NodeType} from "../types";
import {DefaultByType, initialEdges, initialNodes, elements} from "../defaults.ts";
import SimulationPanel from "../Simulation/SimulationPanel.tsx";
import Header from "../Header/Header.tsx";


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
    wire: WireEdge,
};

let id = 0;
const getId = (type: NodeType) => `${type}_${id++}`;

function isOverlap(node1: Node, node2: Node) {
    const buffer = 0; // небольшой зазор для более естественного взаимодействия
    return !(
        node1.position.x + (node1.width ?? 0) + buffer < node2.position.x ||
        node1.position.x > node2.position.x + (node2.width ?? 0) + buffer ||
        node1.position.y + (node1.height ?? 0) + buffer < node2.position.y ||
        node1.position.y > node2.position.y + (node2.height ?? 0) + buffer
    );
}


function Flow() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
    const [erroredNodes, setErroredNodes] = useState<Node[]>([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [menu, setMenu] = useState<{
        node: BaseNodeData<NodeProps>;
        top?: number;
        left?: number;
        right?: number;
        bottom?: number;
    } | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const onNodesChange: OnNodesChange = useCallback((changes) => {
        setNodes((currentNodes) => {
            return applyNodeChanges(changes, currentNodes).map((node) => {
                // Проверяем, не пересекается ли текущий узел с другими узлами
                const otherNodes = currentNodes.filter(n => n.id !== node.id);
                const hasOverlap = otherNodes.some(otherNode => isOverlap(node, otherNode));

                if (hasOverlap) {
                    // Если есть пересечение, возвращаем узел без изменений
                    return currentNodes.find(n => n.id === node.id) || node;
                }

                // Если пересечения нет, применяем изменения
                return node;
            });
        });
    }, [setNodes]);

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

    const deleteErroredNodes = useCallback(() => {
        console.log(erroredNodes);
        setNodes((nds) => nds.filter((node: Node) => !erroredNodes.includes(node)));
    }, [setNodes, erroredNodes]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type: string = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) return;

            const position = reactFlowInstance?.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            if (!position) return;

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
            if (!pane) return;

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
        className: (erroredNodes.includes(node as BaseNodeData<NodeProps>) ? 'errored ' : '') +
            (selectedNodes.includes(node) ? 'selected ' : '')
    })), [nodes, erroredNodes, selectedNodes]);

    const onPaneClick = useCallback(() => {
        setMenu(null);
        setSelectedNodes([]);
    }, [setMenu, setSelectedNodes]);

    useOnSelectionChange({
        onChange: ({nodes}) => {
            setSelectedNodes(nodes);
        },
    });

    const [ElementsManagerMarginTop, setElementsManagerMarginTop] = useState(86);

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
            minZoom={1.2}
            maxZoom={2.2}
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
            attributionPosition='bottom-left'
        >
            {menu && <ContextMenu onClick={onPaneClick} onNodeDelete={onNodeDelete} {...menu} />}

            <Panel position='top-left'>

                <Header setMarginTop={setElementsManagerMarginTop}/>
                <ElementsManager nodes={nodes as BaseNodeData<NodeProps>[]} elements={elements}
                                 erroredNodes={erroredNodes as BaseNodeData<NodeProps>[]}
                                 selectedNodes={selectedNodes as BaseNodeData<NodeProps>[]}
                                 setSelectedNodes={setSelectedNodes} onNodeDelete={onNodeDelete}
                                 marginTop={ElementsManagerMarginTop}/>
            </Panel>

            <Panel position='bottom-left'>
                <AddElementMenu elements={elements}/>
            </Panel>

            <Panel position='bottom-right'>
                <SimulationPanel
                    nodes={nodes as BaseNodeData<NodeProps>[]}
                    edges={edges}
                    deleteErroredNodes={deleteErroredNodes}
                    setErroredNodes={setErroredNodes}
                />
            </Panel>

            <Controls position='top-right' style={{top: '86px'}}/>

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
