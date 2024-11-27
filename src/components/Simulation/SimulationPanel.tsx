import {useCallback} from "react";
import Button from "react-bootstrap/Button";
import error_icon from '../../assets/Icons/error_icon.png';
import play_icon from '../../assets/Icons/play_icon.svg';
import pause_icon from '../../assets/Icons/pause_icon.svg';
import Image from "react-bootstrap/Image";
import {useReactFlow} from "../Main/ReactFlowContext";
import './SimulationPanel.css';


export default function SimulationPanel() {
  const {simulationState, setSimulationState} = useReactFlow();

  const states = {
    'running': {
      icon: pause_icon,
      text: 'Пауза',
      variant: 'primary'
    },
    'error': {
      icon: error_icon,
      text: 'Ошибка',
      variant: 'danger'
    },
    'stopped': {
      icon: play_icon,
      text: 'Запустить',
      variant: 'primary'
    }
  }

  const handleSimulationBody = useCallback(() => {
    if (simulationState === 'running') {
      setSimulationState('stopped');
    } else {
      setSimulationState('running');
    }
  }, [simulationState, setSimulationState]);

  return (
    <div className={'simulation-panel ' + (simulationState === 'running' ? 'active' : '')} style={{width: 460}}>
      <Button onClick={handleSimulationBody}
              variant={states[simulationState].variant}
              style={{width: '148px', height: '46px', position: 'relative', right: '-30%'}}>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '500'
                }}>{states[simulationState].text}</span>
        <Image src={states[simulationState].icon} width={20} height={20}
               alt="Запустить"
               style={{padding: '2px', margin: '4px'}}/>
      </Button>
      <div className='panel'>
        <Image src={'/картинка.png'} style={{width: 425}}/>
      </div>
    </div>
  )
}
