import './App.css';
import Main from './components/Main/Flow'
import {ReactFlowProvider} from "./components/Main/ReactFlowContextProvider.tsx";


function App() {

    return (
        <ReactFlowProvider>
            <Main />
        </ReactFlowProvider>
    );
}

export default App;
