import React, {useState} from "react";
import {ReactFlowProvider} from "reactflow";
import Flow from "../Field/Flow";
import SideBar from "../SideBar/SideBar";
import HSplit from "../HSplit/HSplit";
import './Field.css'

export default function Body() {

    const [sidebarWidth, setSidebarWidth] = useState(336);

    return (
        <ReactFlowProvider>
            <SideBar width={sidebarWidth} />
            <HSplit onDrag={(newWidth) => setSidebarWidth(newWidth)}  left={sidebarWidth}/>
            <Field leftInset={sidebarWidth}/>
        </ReactFlowProvider>
    )
}

interface FieldProps {
    leftInset: number; // Ширина Sidebar
}

const Field: React.FC<FieldProps> = ({leftInset}) => {

    return (
        <div
            style={{
                position: 'absolute',
                inset: `86px 0 0 ${leftInset + 12}px`
            }}>
            <Flow/>
        </div>
    );
}

