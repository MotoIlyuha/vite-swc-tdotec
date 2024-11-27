import ReactFlow, {
    Background,
    Controls,
    Panel,
    BackgroundVariant,
    NodeTypes,
    FitViewOptions,
    ConnectionMode,
    ConnectionLineType, DefaultEdgeOptions,
} from 'reactflow';
import 'reactflow/dist/style.css';

import {
    AmmeterNode,
    BulbNode,
    CapacitorNode,
    DiodeNode,
    GalvanometerNode,
    OhmmeterNode,
    PolarCapacitorNode,
    PowerSourceNode,
    ResistorNode,
    SwitchNode,
    VoltMeterNode,
} from '../Nodes/NodeTypes/NodeTypes';
import WireEdge from '../Nodes/EdgeTypes/WireEdge.tsx';
import ContextMenu from '../Nodes/ContextMenu/ContextMenu.tsx';
import ElementsManager from './ElementsManager.tsx';
import SimulationPanel from '../Simulation/SimulationPanel.tsx';
import Header from '../Header/Header.tsx';
import {useReactFlow} from './ReactFlowContext';


const fitViewOptions: FitViewOptions = {
    padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: true,
};

const nodeTypes: NodeTypes = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resistor: ResistorNode,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    powerSource: PowerSourceNode,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    bulb: BulbNode,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    switch: SwitchNode,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    capacitor: CapacitorNode,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    polarCapacitor: PolarCapacitorNode,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    diode: DiodeNode,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ammeter: AmmeterNode,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    voltmeter: VoltMeterNode,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ohmmeter: OhmmeterNode,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    galvanometer: GalvanometerNode
};

const edgeTypes = {
    wire: WireEdge,
};


export default function Flow() {
    const {menu, setReactFlowInstance, ...props} = useReactFlow();

    return (
        <ReactFlow
            fitView
            fitViewOptions={fitViewOptions}
            minZoom={1.2}
            maxZoom={2.2}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            connectionLineType={ConnectionLineType.Step}
            connectionMode={ConnectionMode.Loose}
            defaultEdgeOptions={defaultEdgeOptions}
            onInit={setReactFlowInstance}
            snapToGrid={true}
            snapGrid={[20, 20]}
            attributionPosition='bottom-left'
            {...props}
        >
            {menu && <ContextMenu {...menu} />}

                <Panel position="top-left">
                    <Header/>
                    <ElementsManager/>
                </Panel>

                <Panel position="bottom-right">
                    <SimulationPanel/>
                </Panel>

                <Controls position="top-right" style={{top: '86px'}}/>

                <Background id="1" gap={20} color="#ddd" variant={BackgroundVariant.Lines}/>
                <Background id="2" gap={100} color="#aaa" variant={BackgroundVariant.Lines}/>
        </ReactFlow>
    );
}
