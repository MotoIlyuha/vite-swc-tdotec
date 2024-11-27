// ReactFlowContextProvider.tsx
import React, {createContext, useState, useCallback, useMemo, useRef} from 'react';
import {
    Node,
    Edge,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Connection,
    OnNodesChange,
    OnEdgesChange, NodeChange, EdgeChange, OnSelectionChangeParams, ReactFlowInstance
} from 'reactflow';
import {CircuitNode, NodeDataProps, NodeProps, NodeType, theme} from "../types.ts";
import {DefaultValues, useInitialSetup} from "../defaults.ts";


interface MenuProps {
    node: CircuitNode<NodeProps>;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}

interface ReactFlowContextProps {
    nodes: Node[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    edges: Edge[];
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onDataChange: (
        id: CircuitNode<NodeProps>['id'],
        values?: NodeDataProps<NodeProps>['values'],
        orientation?: NodeDataProps<NodeProps>['orientation'],
        polar?: NodeDataProps<NodeProps>['polar']
    ) => void;
    onNodeDelete: (nodeId: string) => void;
    onConnect: (params: Connection) => void;
    selectableNodes: Node[];
    setSelectedNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    selectedNodes: Node[];
    toggleEdgeAnimation: (state: boolean) => void;
    setAnimateEdges: React.Dispatch<React.SetStateAction<boolean>>;
    animateEdges: boolean;
    onSelectionChange: (params: OnSelectionChangeParams) => void;
    reactFlowInstance: ReactFlowInstance | null;
    themeMode: theme;
    ref: React.RefObject<HTMLDivElement>;
    setThemeMode: React.Dispatch<React.SetStateAction<theme>>;
    menu: MenuProps | null;
    setMenu: React.Dispatch<React.SetStateAction<MenuProps | null>>;
    onDragOver: (event: React.DragEvent) => void;
    onDrop: (event: React.DragEvent) => void;
    setReactFlowInstance: React.Dispatch<React.SetStateAction<ReactFlowInstance | null>>;
    onNodeContextMenu: (event: React.MouseEvent, node: Node) => void;
    onPaneClick: (event: React.MouseEvent) => void;
    addNewNode: (node: CircuitNode<NodeProps>) => void;
    uniquePowerSource: () => boolean;
    erroredNodes: Node[];
    setErroredNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    simulationState: SimulationState;
    setSimulationState: React.Dispatch<React.SetStateAction<SimulationState>>;
    selectErroredNodes: (errored_nodes: CircuitNode<NodeProps>[]) => void;
    deleteErroredNodes: (error_nodes: CircuitNode<NodeProps>[]) => void;
}

export const ReactFlowContextProvider = createContext<ReactFlowContextProps | undefined>(undefined);

let id = 0;
const getId = (type: NodeType) => `${type}_${id++}`;

function isOverlap(node1: Node, node2: Node) {
    const buffer = 1; // небольшой зазор для более естественного взаимодействия
    return !(
        node1.position.x + (node1.width ?? 0) + buffer < node2.position.x ||
        node1.position.x > node2.position.x + (node2.width ?? 0) + buffer ||
        node1.position.y + (node1.height ?? 0) + buffer < node2.position.y ||
        node1.position.y > node2.position.y + (node2.height ?? 0) + buffer
    );
}

type SimulationState = 'running' | 'error' | 'stopped';

export const ReactFlowProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [animateEdges, setAnimateEdges] = useState(false);
    const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
    const [erroredNodes, setErroredNodes] = useState<Node[]>([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [themeMode, setThemeMode] = useState<theme>('light');
    const [simulationState, setSimulationState] = useState<SimulationState>('stopped');
    const ref = useRef<HTMLDivElement>(null);
    const [menu, setMenu] = useState<{
        node: CircuitNode<NodeProps>;
        top?: number;
        left?: number;
        right?: number;
        bottom?: number;
    } | null>(null);

    const onNodesChange: OnNodesChange = useCallback((changes: NodeChange[]) => {
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
        setSimulationState('stopped');
    }, [setNodes]);

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => {
            setEdges((eds) => applyEdgeChanges(changes, eds));
            setSimulationState('stopped');
        },
        [setEdges],
    );

    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) => addEdge({...params, type: 'wire'}, eds));
            setSimulationState('stopped');
        },
        [setEdges]
    );

    const onDataChange = useCallback((
            id: CircuitNode<NodeProps>['id'],
            values?: NodeDataProps<NodeProps>['values'],
            orientation?: NodeDataProps<NodeProps>['orientation'],
            polar?: NodeDataProps<NodeProps>['polar']
        ) => {
            setNodes((nodes) =>
                nodes.map((node) => ({
                    ...node,
                    data: {
                        ...node.data,
                        values: node.id === id && values ? values : node.data.values,
                        orientation: node.id === id && orientation ? orientation : node.data.orientation,
                        polar: node.id === id && polar ? polar : node.data.polar,
                    },
                }))
            );
            console.log(id, values, orientation, polar);
        },
        [setNodes]
    );

    const onNodeDelete = useCallback(
        (nodeId: string) => {
            setNodes((nds) => nds.filter((node: Node) => node.id !== nodeId));
            setEdges((eds) => eds.filter((edge: Edge) => edge.source !== nodeId && edge.target !== nodeId));
            setSimulationState('stopped');
        },
        [setNodes, setEdges]
    );

    const toggleEdgeAnimation = useCallback(
        (state: boolean) => {
            if (state) {
                setEdges((eds) => eds.map((edge) => ({...edge, animated: !animateEdges})));
                setAnimateEdges(!animateEdges);
            } else {
                setEdges((eds) => eds.map((edge) => ({...edge, animated: false})));
                setAnimateEdges(false);
            }
        },
        [animateEdges, setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const addNewNode = useCallback((node: CircuitNode<NodeProps>) => {
        setNodes((nodes) => [...nodes,
            {
                ...node,
                id: getId(node.type as NodeType),
                data: {
                    ...node.data,
                    values: DefaultValues[node.type as NodeType],
                    orientation: 'hor',
                    polar: 'pos',
                    onDataChange: onDataChange as NodeDataProps<NodeProps>['onDataChange'],
                },
            }
        ]);
    }, [setNodes, onDataChange]);

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

            addNewNode({
                id: getId(type as NodeType),
                data: {
                    values: DefaultValues[type as NodeType],
                    orientation: 'hor',
                    polar: 'pos',
                    onDataChange: onDataChange as NodeDataProps<NodeProps>['onDataChange'],
                },
                position,
                type: type as NodeType,
            });
        },
        [addNewNode, onDataChange, reactFlowInstance]
    );

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: Node) => {
            event.preventDefault();

            const pane = ref.current?.getBoundingClientRect();
            if (!pane) return;

            // Выделение элемента при нажатии правой кнопки мыши
            setNodes((nodes) =>
                nodes.map((nd) => ({
                    ...nd,
                    selected: node.id === nd.id,
                }))
            );

            setMenu({
                node: node as CircuitNode<NodeProps>,
                top: event.clientY < pane.height - 50 ? event.clientY : undefined,
                left: event.clientX < pane.width - 50 ? event.clientX : undefined,
                right: event.clientX >= pane.width - 50 ? pane.width - event.clientX : undefined,
                bottom: event.clientY >= pane.height - 50 ? pane.height - event.clientY : undefined,
            });
        },
        [setMenu, setNodes]
    );

    const onSelectionChange = useCallback(
        (params: OnSelectionChangeParams) => {
            setSelectedNodes(params.nodes);
        },
        [setSelectedNodes]
    );

    const deleteErroredNodes = useCallback(() => {
        setNodes(nodes => nodes.filter(node => !erroredNodes.includes(node as CircuitNode<NodeProps>)));
    }, [setNodes, erroredNodes]);

    const selectableNodes = useMemo(
        () =>
            nodes.map((node) => ({
                ...node,
                className: (erroredNodes.includes(node as CircuitNode<NodeProps>) ? 'errored ' : '') +
                    (selectedNodes.includes(node) ? 'selected ' : ''),
            })),
        [nodes, erroredNodes, selectedNodes]
    );

    const onPaneClick = useCallback(() => {
        setMenu(null);
        setSelectedNodes([]);
    }, [setMenu, setSelectedNodes]);

    const uniquePowerSource = useCallback((): boolean => {
        return nodes.filter((node) => node.type === NodeType.PowerSource).length === 0;
    }, [nodes]);

    const selectErroredNodes = useCallback((errored_nodes: CircuitNode<NodeProps>[]) => {
        setNodes(nodes => nodes.map((node) => ({
            ...node,
            data: {
                ...node.data,
                errored: errored_nodes.includes(node as CircuitNode<NodeProps>),
            }
        })))
    }, [setNodes]);

    useInitialSetup(setNodes, setEdges, onDataChange);

    return (
        <ReactFlowContextProvider.Provider
            value={{
                edges,
                nodes,
                ref,
                onConnect,
                onDataChange,
                onEdgesChange,
                onNodeDelete,
                onNodesChange,
                setEdges,
                setNodes,
                selectableNodes,
                toggleEdgeAnimation,
                onDragOver,
                onDrop,
                onNodeContextMenu,
                onPaneClick,
                onSelectionChange,
                reactFlowInstance,
                setReactFlowInstance,
                themeMode,
                setThemeMode,
                menu,
                setMenu,
                addNewNode,
                uniquePowerSource,
                erroredNodes,
                setErroredNodes,
                setSelectedNodes,
                selectedNodes,
                setAnimateEdges,
                animateEdges,
                simulationState,
                setSimulationState,
                selectErroredNodes,
                deleteErroredNodes
            }}>
            {children}
        </ReactFlowContextProvider.Provider>
    );
};
