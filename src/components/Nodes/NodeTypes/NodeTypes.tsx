import {Handle, NodeToolbar, Position, useUpdateNodeInternals} from 'reactflow';
import {memo, useCallback} from 'react';
import './NodeStyles.css';

import {
    AmmeterNodeProps,
    BulbNodeProps,
    CapacitorNodeProps,
    CircuitNode,
    DiodeNodeProps, GalvanometerNodeProps,
    NodeDataProps,
    NodeProps,
    NodeType, OhmmeterNodeProps,
    PowerSourceNodeProps,
    ResistorNodeProps,
    SwitchNodeProps, VoltmeterNodeProps
} from "../../types";

import rotate_icon from '../../../assets/Icons/rotate_icon.png';
import reflect_icon from '../../../assets/Icons/reflect_icon.png';
import {getRgbColorByWavelength, ledBrightness} from "../../utils.ts";


function addPolarSigns(orientation: CircuitNode<NodeProps>['data']['orientation']) {
    return <g>
        <text x="65" y="15" rotate={orientation === 'ver' ? '90' : '0'} dy={orientation === 'ver' ? '-10' : '0'}
              stroke="#fc0202" textAnchor="start" strokeWidth='1.5'
              fontFamily="Besley" fontSize="16" id="svg_3" fill="#ff0000">+</text>
        <text x="5" y="15" rotate={orientation === 'ver' ? '90' : '0'} dy={orientation === 'ver' ? '-10' : '0'}
              stroke="#007fff" textAnchor="start" strokeWidth='1.5'
              fontFamily="Besley" fontSize="16" id="svg_5" fill="#007fff">−</text>
    </g>
}

function ResistorFrame() {
    return <svg width="80" height="40" xmlns="http://www.w3.org/2000/svg">
        <g>
            <rect id="svg_1" height="16.528922" width="52.892551" y="11.735539" x="13.553722" strokeWidth="1.5"
                  stroke="#000" fill="#00000000"/>
            <line stroke="#000" id="svg_3" y2="20" x2="67.957632" y1="20" x1="79.25" strokeWidth="1.5"/>
            <line stroke="#000" id="svg_4" y2="20.38223" x2="0.75" y1="20.38223" x1="12.042368" strokeWidth="1.5"/>
        </g>
    </svg>;
}

function BulbFrame() {

    return <svg width="80" height="40" xmlns="http://www.w3.org/2000/svg">
        <g>
            <line id="svg_3" y2="20" x2="79.249999" y1="20" x1="51.501757" fillOpacity="null" strokeOpacity="null"
                  strokeWidth="1.5" stroke="#000" fill="none"/>
            <line id="svg_4" y2="20" x2="28.654284" y1="20" x1="0.906043" strokeWidth="1.5" stroke="#000" fill="none"/>
            <ellipse ry="10.313631" rx="10.313631" id="svg_9" cy="20" cx="40" strokeWidth="1.5" stroke="#000"
                     fill='#00000000'/>
            <line transform="rotate(-45 40,20) " id="svg_12" y2="20" x2="50.675682" y1="20" x1="29.324317"
                  strokeWidth="1.5" stroke="#000" fill="none"/>
            <line transform="rotate(45 40,20)" id="svg_13" y2="20" x2="50.675682" y1="20" x1="29.324317" strokeWidth="1.5"
                  stroke="#000" fill="none"/>
        </g>
    </svg>;
}

function CapacitorFrame() {
    return <svg width="80" height="40" xmlns="http://www.w3.org/2000/svg">
        <g>
            <line stroke="#000" fill="none" strokeWidth="1.5" x1="34.83061" y1="20" x2="0.75" y2="20" id="svg_4"/>
            <line fill="none" strokeWidth="1.5" x1="37.787002" y1="9.316282"
                  x2="37.787002" y2="29.832652" id="svg_6" stroke="#000"/>
            <line fill="none" strokeWidth="1.5" x1="42.328224" y1="9.316283"
                  x2="42.328224" y2="29.832653" id="svg_9" stroke="#000"/>
            <line stroke="#000" strokeWidth="1.5" x1="79.25" y1="20" x2="45.169394" y2="20" id="svg_1"/>
        </g>
    </svg>;
}

function PolarCapacitorFrame({orientation}: { orientation: CircuitNode<NodeProps>['data']['orientation'] }) {
    return <svg width="80" height="40" xmlns="http://www.w3.org/2000/svg">
        <g>
            <line stroke="#000" fill="none" strokeWidth="1.5" x1="34.83061" y1="20" x2="0.75" y2="20" id="svg_4"/>
            <line fill="none" strokeWidth="1.5" x1="37.787002" y1="9.316282"
                  x2="37.787002" y2="29.832652" id="svg_6" stroke="#000"/>
            <line fill="none" strokeWidth="1.5" x1="42.328224" y1="9.316283"
                  x2="42.328224" y2="29.832653" id="svg_9" stroke="#000"/>
            <line stroke="#000" strokeWidth="1.5" x1="79.25" y1="20" x2="45.169394" y2="20" id="svg_1"/>
            {orientation && addPolarSigns(orientation)}
        </g>
    </svg>;
}

function DiodeFrame({orientation, current, waveLength}: {
    orientation: CircuitNode<NodeProps>['data']['orientation']
    current: DiodeNodeProps['current'],
    waveLength: DiodeNodeProps['waveLength'],
}) {

    return <svg width="80" height="40" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter height="200%" width="200%" y="-50%" x="-50%" id="svg_2_blur">
                <feGaussianBlur stdDeviation='6' in="SourceGraphic"/>
            </filter>
        </defs>
        <g>
            <ellipse stroke={getRgbColorByWavelength(waveLength)} fill={getRgbColorByWavelength(waveLength)}
                     opacity={ledBrightness(current) < 0.1 ? 0 : ledBrightness(current)}
                     filter="url(#svg_2_blur)" strokeWidth="1.5" cx="40.03685" cy="20" id="svg_2" rx="13.8256" ry="14"/>
            <line strokeWidth="1.5" x1="30.51106" y1="9.31628" x2="30.51106" y2="29.83265" id="svg_9" stroke="#000"/>
            <path transform="rotate(-90 41.5289 20)" fill={getRgbColorByWavelength(waveLength)} strokeWidth="1.5"
                  d="m31.88102,30.15248l9.64785,-20.30496l9.64786,20.30496l-19.29571,0z" id="svg_3" stroke="#000"/>
            <g id="svg_7" transform="rotate(-45 41.7999267578125,5.751062393188472) ">
                <path strokeWidth="1.5" d="m40.51776,4.01884l1.28205,-2.24359l1.28205,2.24359l-2.5641,0z"
                      id="svg_4" stroke="#000"/>
                <line stroke="#000" strokeWidth="1.5" x1="41.81717" y1="4.71015" x2="41.81717" y2="9.72687" id="svg_5"/>
            </g>
            <g id="svg_11" transform="rotate(-45 36.002723693847656,6.977372169494628) ">
                <path fill="none" strokeWidth="1.5" d="m34.72066,5.24515l1.28205,-2.24359l1.28205,2.24359l-2.5641,0z"
                      id="svg_8" stroke="#000"/>
                <line fill="none" stroke="#000" strokeWidth="1.5" x1="36.02007" y1="5.93646" x2="36.02007" y2="10.95318"
                      id="svg_10"/>
            </g>
            <line fill="none" strokeWidth="1.5" x1="78.66795" y1="20" x2="1.33206" y2="20" id="svg_1" stroke="#000"/>
            {orientation && addPolarSigns(orientation)}
        </g>
    </svg>;
}

function PowerSourceFrame({orientation}: { orientation: CircuitNode<NodeProps>['data']['orientation'] }) {
    return <svg width="80" height="40" xmlns="http://www.w3.org/2000/svg">
        <g>
            <line stroke="#000" fill="none" strokeWidth="1.5" x1="34.83061" y1="20" x2="0.75" y2="20" id="svg_4"/>
            <line fill="none" strokeWidth="1.5" x1="37.787" y1="14.57625"
                  x2="37.787" y2="25.42375" id="svg_6" stroke="#000"/>
            <line fill="none" strokeWidth="1.5" x1="42.328224" y1="9.316283"
                  x2="42.328224" y2="29.832653" id="svg_9" stroke="#000"/>
            <line stroke="#000" strokeWidth="1.5" x1="79.25" y1="20" x2="45.169394" y2="20" id="svg_1"/>
            {orientation && addPolarSigns(orientation)}
        </g>
    </svg>;
}

interface SwitchFrameProps {
    id: CircuitNode<SwitchNodeProps>['id'];
    onSwitchChange: NodeDataProps<SwitchNodeProps>['onDataChange'];
    switchState: SwitchNodeProps['switchState'];
}

function SwitchFrame({id, onSwitchChange, switchState}: SwitchFrameProps) {

    return <svg width="80" height="40" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="svg_6_blur">
                <feGaussianBlur stdDeviation="1.5" in="SourceGraphic"/>
            </filter>
        </defs>
        <g>
            <rect className="switch_click_aria" filter="url(#svg_6_blur)" height="12.44705" width="24.20061"
                  y="7.49023" x="27.83694" strokeWidth="1.5" stroke="#56aaff" fill="#56aaff"
                  onClick={() => onSwitchChange(id, {switchState: !switchState})}/>
            <line fill="none" stroke="#000" strokeWidth="1.5" x1="51.50176"
                  y1="20" x2="79.25" y2="20" id="svg_3"/>
            <line fill="none" stroke="#000" strokeWidth="1.5" x1="1.38855"
                  y1="20" x2="29.13679" y2="20" id="svg_5"/>
            <ellipse fill="none" strokeWidth="1.5" cx="28" cy="20" id="svg_7"
                     rx="0.65676" ry="0.65676" stroke="#000"/>
            <ellipse fill="none" strokeWidth="1.5" cx="52" cy="20" id="svg_8"
                     rx="0.65676" ry="0.65676" stroke="#000"/>
            <line stroke="#000" fill="none" strokeWidth="1.5" x1="28.75911"
                  transform={`rotate(${!switchState ? 30 : 0} 52 20)`}
                  y1="20" x2="51.24089" y2="20" id="svg_4"/>
        </g>
    </svg>;
}

function MeterFrame({type, orientation, polar}: {
    type: CircuitNode<NodeProps>['type'],
    orientation: CircuitNode<NodeProps>['data']['orientation'],
    polar: CircuitNode<NodeProps>['data']['polar']
}) {
    return <svg width="80" height="40" xmlns="http://www.w3.org/2000/svg">
        <g>
            <line fill="none" stroke="#000" strokeWidth="1.5" x1="51.501757"
                  y1="20" x2="79.25" y2="20" id="svg_3"/>
            <line fill="none" stroke="#000" strokeWidth="1.5" x1="0.906043"
                  y1="20" x2="28.654284" y2="20" id="svg_4"/>
            <ellipse fill="none" stroke="#000" strokeWidth="1.5" cx="40"
                     cy="20" id="svg_9" rx="10.313631" ry="10.313631"/>
            <text id="svg_1" stroke="#000"
                  transform="matrix(0.5747963786125183,0,0,0.5747963786125183,21.45489034334173,13.94921530122042) "
                  textAnchor="start" fontFamily="AzeretMono, Roboto Mono, monospace" fontSize="24" y="20" x="24.5"
                  rotate={orientation === 'ver' ? polar === 'pos' ? '270' : '90' : '0'}
                  dx={orientation === 'ver' ? polar === 'pos' ? '16' : '-2' : '0'}
                  dy={orientation === 'ver' ? polar === 'pos' ? '-2' : '-17.5' : '0'}
                  fill="#000000">{
                    type === NodeType.Ammeter ? 'А' :
                    type === NodeType.Voltmeter ? 'V' :
                    type === NodeType.Ohmmeter ? 'Ω' :
                    type === NodeType.Galvanometer ? '↑' : ''
            }</text>
            {orientation && addPolarSigns(orientation)}
        </g>
    </svg>;
}

export const CircuitElementNode = memo((
    {id, data: {values, orientation, polar, onDataChange}, type, selected}: CircuitNode<NodeProps>
) => {

    const updateNodeInternals = useUpdateNodeInternals();

    const rotateNode = useCallback(() => {
        onDataChange(id, values, orientation === 'hor' ? 'ver' : 'hor');
        updateNodeInternals(id);
    }, [id, onDataChange, orientation, updateNodeInternals, values])

    const reflectNode = useCallback(() => {
        onDataChange(id, values, orientation, polar === 'pos' ? 'neg' : 'pos');
        updateNodeInternals(id);
    }, [id, onDataChange, orientation, polar, updateNodeInternals, values])

    return <>
        <NodeToolbar isVisible={true} position={orientation === 'hor' ? Position.Top : Position.Left}>
            {type === NodeType.Resistor && 'resistance' in values &&
                <div>Сопротивление: {values.resistance}Ом</div>}
            {type === NodeType.Bulb && 'power' in values &&
                <div>Мощность: {values.voltage}Вт</div>}
            {type === NodeType.Bulb && 'voltage' in values &&
                <div>Напряжение: {values.voltage}В</div>}
            {type === NodeType.PowerSource && 'power' in values &&
                <div>Мощность: {values.voltage}Вт</div>}
        </NodeToolbar>
        <div id={id} className={`node ${type} ${orientation} ${selected ? 'selected' : ''}`}
             style={{
                 'width': `${orientation === 'hor' ? 80 : 40}px`,
                 'height': `${orientation === 'hor' ? 40 : 80}px`,
                 'position': 'relative'
             }}>
            <div style={{
                transform: `
                    rotate(${orientation === 'hor' ? 0 : 90}deg)
                    scaleX(${polar === 'pos' ? 1 : -1})
                    translateX(${((orientation === 'ver' || !orientation) && (polar === 'neg' || !polar)) ? -40 : 0}px)
                 `,
            }}>
                {type === NodeType.Resistor && <ResistorFrame/>}
                {type === NodeType.Bulb && <BulbFrame/>}
                {type === NodeType.PowerSource && <PowerSourceFrame orientation={orientation}/>}
                {type === NodeType.Switch && 'switchState' in values && onDataChange &&
                    <SwitchFrame id={id} onSwitchChange={onDataChange} switchState={values.switchState}/>}
                {type === NodeType.Diode && 'current' in values && 'waveLength' in values &&
                    <DiodeFrame orientation={orientation} current={values.current} waveLength={values.waveLength}/>}
                {type === NodeType.Capacitor && <CapacitorFrame/>}
                {type === NodeType.PolarCapacitor && <PolarCapacitorFrame orientation={orientation}/>}
                {(type === NodeType.Ammeter || type === NodeType.Voltmeter ||
                    type === NodeType.Ohmmeter || type === NodeType.Galvanometer) &&
                <MeterFrame type={type} orientation={orientation} polar={polar}/>}
            </div>
            <button className='rotate-button' onClick={rotateNode}
                    style={{transform: `rotate(${orientation === 'hor' ? 0 : 90}deg)`}}>
                <img src={rotate_icon} alt='перевернуть'/>
            </button>
            {polar && <button className='reflect-button' onClick={reflectNode}
                              style={{transform: `rotate(${orientation === 'hor' ? 0 : 90}deg)`}}>
                <img src={reflect_icon} alt='отразить'/>
            </button>}
            <Handle id={id + '_source'} type="source" position={orientation === 'hor' ? Position.Left : Position.Top}/>
            <Handle id={id + '_target'} type="source" position={orientation === 'hor' ? Position.Right : Position.Bottom}/>
        </div>
    </>;
});

export const ResistorNode = memo(
    ({id, data, position, selected}: CircuitNode<ResistorNodeProps>) => {

        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.Resistor}
            position={position}
            data={{
                values: {resistance: data.values.resistance},
                orientation: data.orientation,
                onDataChange: (
                    id: CircuitNode<ResistorNodeProps>['id'],
                    values?: NodeProps,
                    orientation?: CircuitNode<ResistorNodeProps>['data']['orientation']
                ) => data.onDataChange(id, values as ResistorNodeProps, orientation)
            }}
        />;
    }
);

export const BulbNode = memo(
    ({id, data, position, selected}: CircuitNode<BulbNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.Bulb}
            position={position}
            data={{
                values: {power: data.values.power, voltage: data.values.voltage},
                orientation: data.orientation,
                onDataChange: (
                    id: CircuitNode<BulbNodeProps>['id'],
                    values?: NodeProps,
                    orientation?: CircuitNode<BulbNodeProps>['data']['orientation']
                ) => data.onDataChange(id, values as BulbNodeProps, orientation)
            }}
        />;
    }
)

export const PowerSourceNode = memo(
    ({id, data, position, selected}: CircuitNode<PowerSourceNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.PowerSource}
            position={position}
            data={{
                values: {voltage: data.values.voltage},
                orientation: data.orientation,
                polar: data.polar,
                onDataChange: (
                    id: CircuitNode<PowerSourceNodeProps>['id'],
                    values?: NodeProps,
                    orientation?: CircuitNode<PowerSourceNodeProps>['data']['orientation'],
                    polar?: CircuitNode<PowerSourceNodeProps>['data']['polar']
                ) => data.onDataChange(id, values as PowerSourceNodeProps, orientation, polar)
            }}
        />;
    }
)

export const SwitchNode = memo(
    ({id, data, position, selected}: CircuitNode<SwitchNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.Switch}
            position={position}
            data={{
                values: {switchState: data.values.switchState},
                orientation: data.orientation,
                onDataChange: (
                    id: CircuitNode<SwitchNodeProps>['id'],
                    values?: NodeProps,
                    orientation?: CircuitNode<SwitchNodeProps>['data']['orientation']
                ) => data.onDataChange(id, values as SwitchNodeProps, orientation)
            }}
        />;
    }
)

export const DiodeNode = memo(
    ({id, data, position, selected}: CircuitNode<DiodeNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.Diode}
            position={position}
            data={{
                values: {voltage: data.values.voltage, current: data.values.current, waveLength: data.values.waveLength},
                orientation: data.orientation,
                polar: data.polar,
                onDataChange: (
                    id: CircuitNode<DiodeNodeProps>['id'],
                    values?: NodeProps,
                    orientation?: CircuitNode<DiodeNodeProps>['data']['orientation'],
                    polar?: CircuitNode<DiodeNodeProps>['data']['polar']
                ) => data.onDataChange(id, values as DiodeNodeProps, orientation, polar)
            }}
        />;
    }
)

export const CapacitorNode = memo(
    ({id, data, position, selected}: CircuitNode<CapacitorNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.Capacitor}
            position={position}
            data={{
                values: {capacitance: data.values.capacitance},
                orientation: data.orientation,
                onDataChange: (
                    id: CircuitNode<CapacitorNodeProps>['id'],
                    values?: NodeProps,
                    orientation?: CircuitNode<CapacitorNodeProps>['data']['orientation']
                ) => data.onDataChange(id, values as CapacitorNodeProps, orientation)
            }}
        />;
    }
)

export const PolarCapacitorNode = memo(
    ({id, data, position, selected}: CircuitNode<CapacitorNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.PolarCapacitor}
            position={position}
            data={{
                values: {capacitance: data.values.capacitance},
                orientation: data.orientation,
                polar: data.polar,
                onDataChange: (
                    id: CircuitNode<CapacitorNodeProps>['id'],
                    values?: NodeProps,
                    orientation?: CircuitNode<CapacitorNodeProps>['data']['orientation'],
                    polar?: CircuitNode<CapacitorNodeProps>['data']['polar']
                ) => data.onDataChange(id, values as CapacitorNodeProps, orientation, polar)
            }}
        />;
    }
)

export const AmmeterNode = memo(
    ({id, data, position, selected}: CircuitNode<AmmeterNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.Ammeter}
            position={position}
            data={{
                values: {current: data.values.current},
                orientation: data.orientation,
                polar: data.polar,
                onDataChange: (
                    id: CircuitNode<AmmeterNodeProps>['id'],
                    values?: NodeProps,
                    orientation?: CircuitNode<AmmeterNodeProps>['data']['orientation'],
                    polar?: CircuitNode<AmmeterNodeProps>['data']['polar']
                ) => data.onDataChange(id, values as AmmeterNodeProps, orientation, polar)
            }}
        />;
    }
)

export const VoltMeterNode = memo(
    ({id, data, position, selected}: CircuitNode<VoltmeterNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.Voltmeter}
            position={position}
            data={{
                values: {voltage: data.values.voltage},
                orientation: data.orientation,
                polar: data.polar,
                onDataChange: (
                    id: CircuitNode<VoltmeterNodeProps>['id'],
                    values?: NodeProps,
                    orientation?: CircuitNode<VoltmeterNodeProps>['data']['orientation'],
                    polar?: CircuitNode<VoltmeterNodeProps>['data']['polar']
                ) => data.onDataChange(id, values as VoltmeterNodeProps, orientation, polar)
            }}
        />;
    }
)

export const OhmmeterNode = memo(
    ({id, data, position, selected}: CircuitNode<OhmmeterNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.Ohmmeter}
            position={position}
            data={{
                values: {resistance: data.values.resistance},
                orientation: data.orientation,
                polar: data.polar,
                onDataChange: (
                    id: CircuitNode<OhmmeterNodeProps>['id'],
                    values?: NodeProps,
                    orientation?: CircuitNode<OhmmeterNodeProps>['data']['orientation'],
                    polar?: CircuitNode<OhmmeterNodeProps>['data']['polar']
                ) => data.onDataChange(id, values as OhmmeterNodeProps, orientation, polar)
            }}
        />;
    }
)

export const GalvanometerNode = memo(
    ({id, data, position, selected}: CircuitNode<GalvanometerNodeProps>) => {
        return <CircuitElementNode
            id={id}
            selected={selected}
            type={NodeType.Galvanometer}
            position={position}
            data={{
                values: {resistance: data.values.resistance, voltage: data.values.voltage, current: data.values.current},
                orientation: data.orientation,
                polar: data.polar,
                onDataChange: (
                    id: CircuitNode<OhmmeterNodeProps>['id'],
                    values?: NodeProps,
                    orientation?: CircuitNode<OhmmeterNodeProps>['data']['orientation'],
                    polar?: CircuitNode<OhmmeterNodeProps>['data']['polar']
                ) => data.onDataChange(id, values as GalvanometerNodeProps, orientation, polar)
            }}
        />;
    }
)
