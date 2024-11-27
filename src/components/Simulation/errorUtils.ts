import {useCallback} from "react";
import {CircuitNode, NodeProps, NodeType, ErrorType} from "../types";
import {Edge} from "reactflow";
import {useReactFlow} from "../Main/ReactFlowContext";


export function findUnreachableNodes(nodes: CircuitNode<NodeProps>[], edges: Edge[]): CircuitNode<NodeProps>[] {
    const graph = new Map<string, string[]>();
    const visited = new Set<string>();

    // Создаем граф на основе edges
    edges.forEach(edge => {
        if (!graph.has(edge.source)) {
            graph.set(edge.source, []);
        }
        graph.get(edge.source)!.push(edge.target);
    });

    // Находим начальный узел powerSource
    const powerSourceNode = nodes.find(node => node.type === NodeType.PowerSource);
    if (!powerSourceNode) {
        throw new Error("No powerSource node found");
    }

    // Обход в глубину (DFS)
    function dfs(nodeId: string) {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);
        const neighbors = graph.get(nodeId) || [];
        neighbors.forEach(neighbor => dfs(neighbor));
    }

    // Запуск DFS от узла powerSource
    dfs(powerSourceNode.id);

    // Находим все не посещенные узлы
    return nodes.filter(node => !visited.has(node.id));
}


const useErrorChecker = () => {
    const {selectErroredNodes} = useReactFlow();

    const hasError = useCallback((nodes: CircuitNode<NodeProps>[], edges: Edge[]): [ErrorType, CircuitNode<NodeProps>[]] => {
        if (nodes.length === 0) {
            return [ErrorType.EmptyCircuit, []];
        } else if (nodes.filter(node => node.type === NodeType.PowerSource).length === 0) {
            return [ErrorType.NoPowerSource, []];
        } else {
            const unreachableNodes = findUnreachableNodes(nodes as CircuitNode<NodeProps>[], edges);
            if (unreachableNodes.length > 0) {
                selectErroredNodes(unreachableNodes as CircuitNode<NodeProps>[]);
                return [ErrorType.ExtraElements, unreachableNodes];
            }
        }
        return [ErrorType.None, []];
    }, [selectErroredNodes]);

    return {hasError};
};

export default useErrorChecker;
