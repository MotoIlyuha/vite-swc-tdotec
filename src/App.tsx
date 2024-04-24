import './App.css';
import Main from './components/Main/Flow'
import {ReactFlowProvider} from "reactflow";

function App() {

    return (
        <ReactFlowProvider>
            <Main />
        </ReactFlowProvider>
    );
}

export default App;
