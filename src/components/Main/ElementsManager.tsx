import Image from "react-bootstrap/Image";
import {CircuitNode, CircuitElementType, NodeProps} from "../types";

import delete_icon from "../../assets/Icons/delete_icon.png";
import arrow_icon from "../../assets/Icons/arrow_icon.png";
import {useCallback, useEffect, useState} from "react";
import {CircuitElementContextMenu} from "../Nodes/ContextMenu/ContextMenu.tsx";
import HideButton from "../HideButton/HideButton.tsx";


interface ElementsManagerProps {
    nodes: CircuitNode<NodeProps>[];
    selectedNodes: CircuitNode<NodeProps>[];
    setSelectedNodes: (node: CircuitNode<NodeProps>[]) => void;
    erroredNodes: CircuitNode<NodeProps>[]
    elements: CircuitElementType;
    onNodeDelete: (arg0: string) => void;
    marginTop?: number;
}

export default function ElementsManager({nodes, selectedNodes, setSelectedNodes, erroredNodes, elements, onNodeDelete, marginTop}: ElementsManagerProps) {

    const [showValues, setShowValues] = useState<boolean[]>(nodes.map(() => false));
    const [rotateValues, setRotateValues] = useState<boolean[]>(nodes.map(() => false));
    const [marginRight, setMarginRight] = useState<number>(-300);

    useEffect(() => {
        setShowValues(prevShowValues => {
            const newShowValues = [...prevShowValues];
            while (newShowValues.length < nodes.length) {
                newShowValues.push(false);
            }
            if (newShowValues.length > nodes.length) {
                newShowValues.length = nodes.length;
            }
            return newShowValues;
        });

        setRotateValues(prevRotateValues => {
            const newRotateValues = [...prevRotateValues];
            while (newRotateValues.length < nodes.length) {
                newRotateValues.push(false);
            }
            if (newRotateValues.length > nodes.length) {
                newRotateValues.length = nodes.length;
            }
            return newRotateValues;
        });
    }, [nodes]);


    const handleNodeClick = useCallback((node: CircuitNode<NodeProps>) => {
        setSelectedNodes([node]);
    }, [setSelectedNodes]);

    const isSelected = useCallback((node: CircuitNode<NodeProps>) =>
        selectedNodes.some(selectedNode => selectedNode.id === node.id),
    [selectedNodes]);

    const toggleShowValues = useCallback((index: number) => {
        setShowValues(prevShowValues => prevShowValues.map((value, i) => i === index ? !value : value));
    }, []);

    const toggleRotateValues = useCallback((index: number) => {
        setRotateValues(prevRotateValues => prevRotateValues.map((value, i) => i === index ? !value : value));
    }, []);

    const handleHide = () => {
        setMarginRight(marginRight === -300 ? -15 : -300);
    }

    return (
        <div style={{
            width: '270px',
            position: 'absolute',
            padding: '8px 0',
            margin: 15,
            top: marginTop,
            right: marginRight,
            transition: 'all 0.5s ease-in-out',
        }}>
        <div className="elements-manager">
            {nodes.length === 0 ? <span>Добавьте хотя бы один элемент на рабочее пространство</span> :
            nodes.map((node, index) => (
                <div className={'element ' + (isSelected(node) ? 'selected ' : '') + (erroredNodes.includes(node) ? 'errored ' : '')} key={node.id}
                     onClick={() => handleNodeClick(node)}>
                    <div className='element-header'>
                    <Image src={elements[node.type].icon}/>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>{elements[node.type]?.name}</div>
                        <Image className='show_values' src={arrow_icon} onClick={(e) => {
                            e.stopPropagation();
                            toggleShowValues(index);
                            toggleRotateValues(index);
                        }} style={{
                                transform: rotateValues[index] ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease-in-out'
                            }}/>
                    </div>
                    <button className='delete-button' onClick={(e) => {
                        e.stopPropagation();
                        onNodeDelete(node.id);
                    }}
                            style={{
                                borderRadius: '4px',
                                borderWidth: '0',
                                borderColor: '#ffacbb',
                            }}>
                        <Image src={delete_icon} style={{
                            width: '16px',
                            height: '16px',
                        }}/>
                    </button>
                </div>
                {showValues[index] && <CircuitElementContextMenu id={node.id} data={node.data} type={node.type} position={node.position}/>}
                </div>
            ))}
        </div>
            <HideButton orientation='right' position={{x: -35, y: 45}} handleClick={handleHide} />
        </div>
    );
}