import './App.css';
import Header from "./components/Header/Header";
import Body from "./components/Body/Body";
import {ReactFlowProvider} from "reactflow";

function App() {

    return (
        <div className="App">
            <ReactFlowProvider>
                <Header/>
                <Body/>
            </ReactFlowProvider>
        </div>
    );
}

export default App;
