import Button from "react-bootstrap/Button";
import play_icon from '../../assets/Icons/play_icon.svg';
import pause_icon from '../../assets/Icons/pause_icon.svg';
import Image from "react-bootstrap/Image";
import {useState} from "react";
import './SimulationPanel.css';
import {BaseNodeData, CircuitErrorsType, NodeProps, NodeType} from "../types.ts";
import SuggestionDeleteErrors from "../Main/SuggestionDeleteErrors.tsx";


interface SimulationPanelProps {
    nodes: BaseNodeData<NodeProps>[];
    edges: Edge[];
    setErroredNodes: (node: BaseNodeData<NodeProps>[]) => void;
    deleteErroredNodes: () => void;
}

type SimulationState = 'running' | 'error' | 'stopped';


export default function SimulationPanel({nodes, edges, setErroredNodes, deleteErroredNodes}: SimulationPanelProps) {
    const [simulationState, setSimulationState] = useState<SimulationState>('stopped');
    const [errors, setErrors] = useState<CircuitErrorsType[]>([]);

    const filterCircuit = (nodes: BaseNodeData<NodeProps>[], edges: Edge[]): SimulationState => {

        if (simulationState === 'running') return 'stopped';

        const nodeMap: Map<string, Node> = new Map(nodes.map(node => [node.id, node]));
        const adjacencyList: Map<string, string[]> = new Map();

        // Build the adjacency list from edges
        edges.forEach(edge => {
            if (!adjacencyList.has(edge.source)) {
                adjacencyList.set(edge.source, []);
            }
            if (!adjacencyList.has(edge.target)) {
                adjacencyList.set(edge.target, []);
            }
            adjacencyList.get(edge.source)!.push(edge.target);
            adjacencyList.get(edge.target)!.push(edge.source);
        });

        const visited = new Set<string>();
        const components: string[][] = [];

        // Find all connected components
        nodes.forEach(node => {
            if (!visited.has(node.id)) {
                const queue: string[] = [node.id];
                const component: string[] = [];

                while (queue.length > 0) {
                    const current = queue.shift()!;
                    if (!visited.has(current)) {
                        visited.add(current);
                        component.push(current);
                        const neighbours = adjacencyList.get(current) || [];
                        neighbours.forEach(n => {
                            if (!visited.has(n)) {
                                queue.push(n);
                            }
                        });
                    }
                }

                components.push(component);
            }
        });

        // Filter components that contain a power source
        const filteredNodes: Node[] = [];
        const filteredEdges: Edge[] = [];

        components.forEach(component => {
            const containsPowerSource = component.some(nodeId => nodeMap.get(nodeId)!.type === NodeType.PowerSource);
            if (!containsPowerSource) {
                component.forEach(nodeId => filteredNodes.push(nodeMap.get(nodeId)!));
                edges.forEach(edge => {
                    if (component.includes(edge.source) && component.includes(edge.target)) {
                        filteredEdges.push(edge);
                    }
                });
            }
        });

        console.log([filteredNodes, filteredEdges]);

        if (filteredNodes.length !== 0) {
            setErroredNodes(filteredNodes as BaseNodeData<NodeProps>[]);
            const error: CircuitErrorsType = {
                name: 'Рабочая область содержит невалидные элементы',
                proposal_solution: 'Удалить эти элементы?',
                button_text: 'Удалить',
                solution_func: deleteErroredNodes
            }
            setErrors([error]);
            return 'error';
        } else {
            setErroredNodes([]);
            return 'running';
        }
    };

    return (
        <div className={'simulation-panel ' + (simulationState === 'running' ? 'active' : '')} style={{width: 460}}>
            <Button onClick={() => setSimulationState(filterCircuit(nodes, edges))}
                    variant={simulationState === 'error' ? 'danger' : 'primary'}
                    style={{width: '148px', height: '46px', position: 'relative', right: '-30%'}}>
                <span style={{
                    fontSize: '18px',
                    fontWeight: '500'
                }}>{simulationState === 'running' ? 'Пауза ' : 'Запустить '}</span>
                <Image src={simulationState === 'running' ? pause_icon : play_icon} width={20} height={20}
                       alt="Запустить"
                       style={{padding: '2px', margin: '4px'}}/>
            </Button>
            <div className='panel'>
                {simulationState === 'error' && <SuggestionDeleteErrors errors={errors}/>}
                <span style={{fontSize: '18px', fontWeight: '500'}}>Симуляция</span>
            </div>
        </div>
    )
}

interface Node {
    id: string;
    type?: NodeType;
}

interface Edge {
    id: string;
    source: string;
    target: string;
}


// function isCircuitCorrect(nodes: BaseNodeData<NodeProps>[], edges: Edge[]): SimulationState {
//     const elements = [...nodes, ...edges];
//     const visited = new Set<string>();
//     const stack: string[] = [];
//
//     elements.forEach(el => {
//         if (isNode(el) && el.type === 'powerSource') {
//             stack.push(el.id);
//         }
//     });
//
//     while (stack.length) {
//         const id = stack.pop();
//         if (!visited.has(id!)) {
//             visited.add(id!);
//             elements.forEach(el => {
//                 if (isEdge(el) && (el.source === id || el.target === id)) {
//                     stack.push(el.source === id ? el.target : el.source);
//                     visited.add(el.source);
//                     visited.add(el.target);
//                 }
//             });
//         }
//     }
//
//     return 'running';
// }
