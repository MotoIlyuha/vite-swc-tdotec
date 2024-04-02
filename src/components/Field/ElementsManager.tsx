import Image from "react-bootstrap/Image";
import {Node} from "reactflow";
import delete_icon from "./Icons/delete_icon.png";

interface ElementsManagerProps {
    nodes: Node[];
    elements: Record<string, Record<string, string>>;
    onNodeDelete: (arg0: string) => void;
}

export default function ElementsManager({nodes, elements, onNodeDelete}: ElementsManagerProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'aliceblue',
            padding: '8px',
            borderRadius: '16px',
            boxShadow: '0px 0px 36px 6px rgba(34, 60, 80, 0.25)'
        }}>
            {nodes.map((node) => (
                <div key={node.id} style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <Image src={elements[node.type?.replace('Node', '') ?? '']?.icon}/>
                    <div>{elements[node.type?.replace('Node', '') ?? '']?.name}</div>
                    <button className='delete-button' onClick={() => onNodeDelete(node.id)}
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
            ))}
        </div>
    );
}