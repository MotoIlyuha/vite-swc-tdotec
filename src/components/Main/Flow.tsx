import React, {useCallback, useMemo, useRef, useState} from 'react';
import ReactFlow, {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    BackgroundVariant,
    Connection,
    ConnectionLineType,
    ConnectionMode,
    Controls,
    DefaultEdgeOptions,
    Edge,
    EdgeTypes,
    FitViewOptions,
    Node,
    NodeTypes,
    OnEdgesChange,
    OnNodesChange,
    OnSelectionChangeParams,
    Panel,
    ReactFlowInstance,
} from 'reactflow';

import 'reactflow/dist/style.css';

import {BulbNode, PowerSourceNode, ResistorNode, SwitchNode} from '../Nodes/NodeTypes/NodeTypes';
import WireEdge from '../Nodes/EdgeTypes/WireEdge.tsx';
import ContextMenu from "../Nodes/ContextMenu/ContextMenu.tsx";
import AddElementMenu from "./AddElementMenu.tsx";
import ElementsManager from "./ElementsManager.tsx";
import {CircuitNode, NodeProps, NodeType, SimulationState,} from "../types";
import {DefaultByType, elements, useInitialSetup} from "../defaults.ts";
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

let id = 2;
const getId = (type: NodeType) => `${type}-${id++}`;

function isOverlap(node1: Node, node2: Node) {
    const buffer = 0;
    return !(
        node1.position.x + (node1.width ?? 0) + buffer < node2.position.x ||
        node1.position.x > node2.position.x + (node2.width ?? 0) + buffer ||
        node1.position.y + (node1.height ?? 0) + buffer < node2.position.y ||
        node1.position.y > node2.position.y + (node2.height ?? 0) + buffer
    );
}


function Flow() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
    const [erroredNodes, setErroredNodes] = useState<Node[]>([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [simulationState, setSimulationState] = useState<SimulationState>(SimulationState.stopped);
    const [menu, setMenu] = useState<{node: CircuitNode<NodeProps>;top?: number;left?: number;right?: number;bottom?: number;} | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const setSimulationMode = useCallback((state: SimulationState) => {
        setSimulationState(state);
        if (state === SimulationState.running) {
            setEdges(edges => edges.map(edge => ({...edge, animated: true})));
        }
        else {
            setEdges(edges => edges.map(edge => ({...edge, animated: false})));
        }
    }, [setEdges]);

    const onNodesChange: OnNodesChange = useCallback((changes) => {
        setNodes((currentNodes) => {
            return applyNodeChanges(changes, currentNodes).map((node) => {
                const otherNodes = currentNodes.filter(n => n.id !== node.id);
                const hasOverlap = otherNodes.some(otherNode => isOverlap(node, otherNode));

                if (hasOverlap) {
                    return currentNodes.find(n => n.id === node.id) || node;
                }

                return node;
            });
        });
        SimulationState.running && setSimulationMode(SimulationState.stopped);
    }, [setSimulationMode, setNodes]);

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => {
            setEdges((eds) => applyEdgeChanges(changes, eds))
            SimulationState.running && setSimulationMode(SimulationState.stopped);
        },
        [setSimulationMode, setEdges],
    );

    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) =>
                addEdge({...params, type: 'smoothstep'}, eds)
            );
        },
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
        setNodes((nds) => nds.filter((node: Node) => !erroredNodes.includes(node)));
        setErroredNodes([]);
    }, [setNodes, erroredNodes]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onCircuitChange = useCallback((
        id: CircuitNode<NodeProps>['id'],
        data?: CircuitNode<NodeProps>['data'],
        orientation?: CircuitNode<NodeProps>['orientation'],
        polar?: CircuitNode<NodeProps>['polar']
    ) => {
            setNodes(nodes => (nodes as CircuitNode<NodeProps>[]).map(node => {
                return {
                    ...node,
                    data: node.id === id && data ? data : node.data,
                    orientation: node.id === id && orientation ? orientation : node.orientation,
                    polar: node.id === id && polar ? polar : node.polar,
                };
            }));
            console.log(id, data, orientation, polar);
        }, [setNodes]);

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

            const newNode: CircuitNode<NodeProps> = {
                id: getId(type as NodeType),
                data: DefaultByType(type as NodeType) as CircuitNode<NodeProps>['data'],
                onChange: () => onCircuitChange(newNode.id, newNode.data, newNode.orientation, newNode.polar),
                orientation: 'hor',
                polar: 'pos',
                position,
                type: type as NodeType,
                selected: false
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [onCircuitChange, reactFlowInstance],
    );

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: Node) => {
            event.preventDefault();

            const pane = ref.current?.getBoundingClientRect();
            if (!pane) return;

            setSelectedNodes([node]);

            setMenu({
                node: node as CircuitNode<NodeProps>,
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
        className: (erroredNodes.includes(node as CircuitNode<NodeProps>) ? 'errored ' : '') +
            (selectedNodes.includes(node) ? 'selected ' : '')
    })), [nodes, erroredNodes, selectedNodes]);

    const onPaneClick = useCallback(() => {
        setMenu(null);
        setSelectedNodes([]);
    }, [setMenu, setSelectedNodes]);

    useInitialSetup(setNodes, setEdges, onCircuitChange);

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
                <ElementsManager nodes={nodes as CircuitNode<NodeProps>[]} elements={elements}
                                 erroredNodes={erroredNodes as CircuitNode<NodeProps>[]}
                                 selectedNodes={selectedNodes as CircuitNode<NodeProps>[]}
                                 setSelectedNodes={setSelectedNodes} onNodeDelete={onNodeDelete}
                                 marginTop={ElementsManagerMarginTop}/>
            </Panel>

            <Panel position='bottom-left'>
                <AddElementMenu elements={elements}/>
            </Panel>

            <Panel position='bottom-right'>
                <SimulationPanel
                    nodes={nodes as CircuitNode<NodeProps>[]}
                    edges={edges}
                    deleteErroredNodes={deleteErroredNodes}
                    setErroredNodes={setErroredNodes}
                    simulationState={simulationState}
                    setSimulationMode={setSimulationMode}
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
