import React from 'react';
import './ContextMenu.css';

interface ContextMenuProps {
    id: string,
    top?: number,
    left?: number,
    right?: number,
    bottom?: number,
    onClick: () => void,
    onNodeDelete: (arg0: string) => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({
     id,
     top,
     left,
     right,
     bottom,
     onClick,
     onNodeDelete,
     ...props
     }) => {

     const handleDeleteClick = () => {
        onClick(); // Закрыть контекстное меню
        onNodeDelete(id); // Удалить узел
    };

    return (
        <div
            style={{top, left, right, bottom}}
            className="context-menu"
            {...props}
        >
            <p style={{margin: '0.5em'}}>
                <small>node: {id}</small>
            </p>
            <button onClick={handleDeleteClick}>delete</button>
        </div>
    );
}

export default ContextMenu;
