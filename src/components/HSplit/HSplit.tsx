import React from 'react';
import './HSplit.css';

interface HSplitProps {
    left: number;
    onDrag: (newWidth: number) => void;
}

const HSplit:React.FC<HSplitProps> = ({ left, onDrag }) => {
    const handleMouseDown = (event: { clientX: any; }) => {
        const startWidth = left;
        const startX = event.clientX;

        const handleMouseMove = (moveEvent: { clientX: number; }) => {
            const newWidth = startWidth + moveEvent.clientX - startX;
            onDrag(newWidth);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            className="hsplit"
            style={{ left: `${left}px` }} // Изменяемое положение
            onMouseDown={handleMouseDown}
        >
            {/* Содержимое HSplit */}
        </div>
    );
};

export default HSplit;
