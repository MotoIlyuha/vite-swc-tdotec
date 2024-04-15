import {createContext, FC, ReactNode, useContext, useState} from 'react';
import {BaseNodeData, NodeProps} from "./types.ts";
import {Node} from "reactflow";

interface SelectionContextType {
    selectedNodes: BaseNodeData<NodeProps>[];
    setSelectedNodes: (nodes: BaseNodeData<NodeProps>[]) => void;
}

const SelectionContext = createContext<SelectionContextType>({
    selectedNodes: [],
    setSelectedNodes: () => {}
});

// eslint-disable-next-line react-refresh/only-export-components
export const useSelection = () => useContext(SelectionContext);

function selectNode(setSelectedNodes: (value: Node[]) => void) {
    return function (nodes: Node[]) {
        nodes.map((node) => {
            node.selected = true
            node.data.selected = true
            node.style = {
                ...node.style,
                border: '2px solid #ffacbb',
                boxShadow: '0 0 0 2px #ffacbb',
                backgroundColor: 'rgb(255,0,45)'
            }
        })
        console.log('Selected nodes: ', nodes.map((nodes) => nodes.id));
        setSelectedNodes(nodes);
    }
}

interface SelectionProviderProps {
    children: ReactNode;
}

export const SelectionProvider: FC<SelectionProviderProps> = ({children}) => {
    const [selectedNodes, setSelectedNodes] = useState<BaseNodeData<NodeProps>[]>([]);
    const selectNodes = selectNode(() => setSelectedNodes(selectedNodes));

    return (
        <SelectionContext.Provider value={{selectedNodes, setSelectedNodes: selectNodes}}>
            {children}
        </SelectionContext.Provider>
    );
};
