import Button from "react-bootstrap/Button";
import play_icon from '../../assets/Icons/play_icon.svg';
import pause_icon from '../../assets/Icons/pause_icon.svg';
import Image from "react-bootstrap/Image";
import {useState} from "react";
import './SimulationPanel.css';
import {Edge, isEdge, isNode} from "reactflow";
import {BaseNodeData, NodeProps} from "../types.ts";


interface SimulationPanelProps {
    nodes: BaseNodeData<NodeProps>[];
    edges: Edge[];
}


export default function SimulationPanel({nodes, edges}: SimulationPanelProps) {
    const [isRunning, setIsRunning] = useState(false);

    return (
        <div className={'simulation-panel ' + (isRunning ? 'active' : '')}>
            <Button onClick={() => setIsRunning(isCircuitCorrect(nodes, edges))}
                    style={{width: '148px', height: '46px'}}>
                <span style={{fontSize: '18px', fontWeight: '500'}}>{isRunning ? 'Пауза ' : 'Запустить '}</span>
                <Image src={isRunning ? pause_icon : play_icon} width={20} height={20} alt="Запустить"
                       style={{padding: '2px', margin: '4px'}}/>
            </Button>
            <div className='panel'>
                <span style={{fontSize: '18px', fontWeight: '500'}}>Симуляция</span>
            </div>
        </div>
    )
}

function isCircuitCorrect(nodes: BaseNodeData<NodeProps>[], edges: Edge[]): boolean {
    const elements = [...nodes, ...edges];
    const visited = new Set<string>();
    const stack: string[] = [];

    elements.forEach(el => {
        if (isNode(el) && el.type === 'powerSource') {
            stack.push(el.id);
        }
    });

    while (stack.length) {
        const id = stack.pop();
        if (!visited.has(id!)) {
            visited.add(id!);
            elements.forEach(el => {
                if (isEdge(el) && (el.source === id || el.target === id)) {
                    stack.push(el.source === id ? el.target : el.source);
                    visited.add(el.source);
                    visited.add(el.target);
                }
            });
        }
    }

    return false;
}
