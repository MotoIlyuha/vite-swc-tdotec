import Button from "react-bootstrap/Button";
import play_icon from '../../assets/Icons/play_icon.svg';
import pause_icon from '../../assets/Icons/pause_icon.svg';
import Image from "react-bootstrap/Image";
import {useState} from "react";
import './SimulationPanel.css';
import {CircuitNode, CircuitErrorsType, NodeProps, NodeType, SimulationState} from "../types.ts";
import SuggestionDeleteErrors from "../Main/SuggestionDeleteErrors.tsx";


interface SimulationPanelProps {
    nodes: CircuitNode<NodeProps>[];
    edges: Edge[];
    setErroredNodes: (node: CircuitNode<NodeProps>[]) => void;
    deleteErroredNodes: () => void;
    simulationState: SimulationState;
    setSimulationMode: (state: SimulationState) => void;
}


export default function SimulationPanel(
    {nodes, edges, setErroredNodes, deleteErroredNodes, simulationState, setSimulationMode}: SimulationPanelProps
) {
    const [errors, setErrors] = useState<CircuitErrorsType[]>([]);

    const filterCircuit = (nodes: CircuitNode<NodeProps>[], edges: Edge[]): SimulationState => {

        if (simulationState === 'running') {
            return SimulationState.stopped;
        }

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
            setErroredNodes(filteredNodes as CircuitNode<NodeProps>[]);
            const error: CircuitErrorsType = {
                name: 'Рабочая область содержит невалидные элементы',
                proposal_solution: 'Удалить эти элементы?',
                button_text: 'Удалить',
                solution_func: deleteErroredNodes
            }
            setErrors([error]);
            return SimulationState.errored;
        } else {
            setErroredNodes([]);
            return SimulationState.running;
        }
    };

    return (
        <div className={'simulation-panel ' + (simulationState === SimulationState.running ? 'active' : '')} style={{width: 460}}>
            <Button onClick={() => setSimulationMode(filterCircuit(nodes, edges))}
                    variant={simulationState === SimulationState.errored ? 'danger' : 'primary'}
                    style={{width: '148px', height: '46px', position: 'relative', right: '-30%'}}>
                <span style={{
                    fontSize: '18px',
                    fontWeight: '500'
                }}>{simulationState === SimulationState.running ? 'Пауза ' : 'Запустить '}</span>
                <Image src={simulationState === SimulationState.running ? pause_icon : play_icon} width={20} height={20}
                       alt="Запустить"
                       style={{padding: '2px', margin: '4px'}}/>
            </Button>
            <div className='panel'>
                {simulationState === SimulationState.errored && <SuggestionDeleteErrors errors={errors}/>}
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
