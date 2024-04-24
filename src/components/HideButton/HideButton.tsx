import arrow_icon from '../../assets/Icons/arrow_icon.png'
import './HideButton.css';
import {useState} from "react";


interface HideButtonProps {
    orientation: 'left' | 'right' | 'top' | 'bottom';
    position: {
        x: number;
        y: number;
    };
    handleClick: () => void;
}

export default function HideButton({orientation, position, handleClick}: HideButtonProps) {

    const [show, setShow] = useState(true);
    const handleShow = () => {
        handleClick();
        setShow(!show)
    }

    let rotate: string = '0deg';
    switch (orientation) {
        case 'left':
            rotate = '90deg';
            break;
        case 'right':
            rotate = '270deg';
            break;
        case 'top':
            rotate = '180deg';
            break;
        case 'bottom':
            rotate = '0deg';
            break;
        default:
            break;
    }

    return (
        <div className={"hide-button " + orientation} style={{
            position: 'absolute',
            right: position.x,
            top: position.y,
            transform: `rotate(${rotate})`,
        }}>
            <button className={'hide-button__handle ' + orientation} onClick={handleShow}>
                <img src={arrow_icon} alt='скрыть' style={{rotate: show ? '180deg' : '0deg'}}/>
            </button>
        </div>
        // <div className="hide-button" style={{
        //     position: 'absolute',
        //     right: 100,
        //     top: 70
        // }}>
        //     <div className="hide-button__handle" style={{
        //         backgroundColor: position ? 'red' : '#1a365d',
        //         width: '60px',
        //         height: '28px',
        //         borderEndEndRadius: 8,
        //         borderEndStartRadius: 8,
        //     }}></div>
        // </div>
    );
}