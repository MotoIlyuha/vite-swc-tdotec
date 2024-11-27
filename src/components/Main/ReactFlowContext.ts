import {useContext} from "react";
import {ReactFlowContextProvider} from "./ReactFlowContextProvider";


export const useReactFlow = () => {
    const context = useContext(ReactFlowContextProvider);
    if (!context) {
        throw new Error('useReactFlow must be used within a ReactFlowProvider');
    }
    return context;
};