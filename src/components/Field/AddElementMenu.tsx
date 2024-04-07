import Image from "react-bootstrap/Image";
import './style.css';

const onDragStart = (event: React.DragEvent, nodeType: string) => {
    if (event.dataTransfer) {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    }
};

export default function AddElementMenu({elements}: {elements: Record<string, Record<string, string>>}) {

    return (
        <div className='add-element-menu'>
            <div className="description">Перетащите элемент, чтобы <br/> добавить его на рабочую область</div>
            <div className="add-menu">
                {Object.keys(elements).map((key) => (
                    <div key={key} className={"dndnode " + key} onDragStart={(event) => onDragStart(event, key)}
                         draggable>
                        <Image src={elements[key]['icon']}/>
                    </div>
                ))}
            </div>
            <div className='name'>{Object.keys(elements).map((key) => elements[key]['name'])}</div>
        </div>
    )
}