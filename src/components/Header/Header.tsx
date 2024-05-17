import {useCallback, useState} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import SplitButton from 'react-bootstrap/SplitButton';
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Image from "react-bootstrap/Image";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import HideButton from "../HideButton/HideButton.tsx";
import {getNodesBounds, getViewportForBounds, useReactFlow} from "reactflow";
import {toPng} from 'html-to-image';

import {theme} from "../types.ts";
import logo from './icons/logo.png'
import ru_icon from './icons/russia.png'
import usa_icon from './icons/usa.png'
import './Header.css';

function Header({setMarginTop, setThemeMode}: { setMarginTop: (marginTop: number) => void, setThemeMode: (themeMode: theme) => void }) {
    const rfInstance = useReactFlow();
    const [topValue, setTopValue] = useState(0);
    const [fileName, setFileName] = useState('Новая схема');
    const [radioValue, setRadioValue] = useState('ru');
    const languages = [
        {name: 'ru', img: ru_icon},
        {name: 'en', img: usa_icon},
    ];

    const imageWidth = 1024;
    const imageHeight = 768;

    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            const flowJSON = JSON.stringify(flow);
            const blob = new Blob([flowJSON], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName + '.json';
            link.click();
            URL.revokeObjectURL(url);
        }
    }, [fileName, rfInstance]);

    const onRestore = useCallback(() => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';

        fileInput.onchange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files ? target.files[0] : null;
            if (file) {
                const reader = new FileReader();
                reader.onload = (e: ProgressEvent<FileReader>) => {
                    if (typeof e.target?.result === 'string') {
                        const flow = JSON.parse(e.target.result);
                        if (flow) {
                            const {x = 0, y = 0, zoom = 1} = flow.viewport || {};
                            rfInstance.setNodes(flow.nodes || []);
                            rfInstance.setEdges(flow.edges || []);
                            rfInstance.setViewport({x, y, zoom});
                        }
                    }
                };
                reader.readAsText(file);
            }
        };

        fileInput.click();
    }, [rfInstance]);

    function handleChange() {
        setFileName((document.getElementById("file-name") as HTMLInputElement)?.value);
    }

    function downloadImage(dataUrl: string) {
        const a = document.createElement('a');

        a.setAttribute('download', fileName + '.png');
        a.setAttribute('href', dataUrl);
        a.click();
    }

    const onSavePNG = () => {
        const nodesBounds = getNodesBounds(rfInstance.getNodes());
        const transform = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);
        const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;

        toPng(viewportElement, {
            backgroundColor: '#1a365d',
            width: imageWidth,
            height: imageHeight,
            style: {
                width: imageWidth.toString(),
                height: imageHeight.toString(),
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
            },
        }).then(downloadImage);
    };

    const handleHideHeader = () => {
        setTopValue(topValue === 0 ? -86 : 0);
        setMarginTop(topValue === 0 ? 0 : 86);
    }

    return (
        <header className="header" style={{
            width: '100vw',
            height: '86px',
            position: 'absolute',
            top: topValue,
            transition: 'top 0.5s ease'
        }}>
            <Navbar id="header" expand="md" className="bg-body-tertiary fixed-top" data-bs-theme="dark"
                    style={{
                        borderEndEndRadius: 16,
                        borderEndStartRadius: 16,
                        position: 'relative',
                    }}>
                <Container className="gap-3" fluid>
                    <Navbar.Brand>
                        <Image src={logo} alt="logo" className="d-inline-block align-top logo"/>
                    </Navbar.Brand>
                    <Navbar.Text>
                        <OverlayTrigger
                            placement="bottom"
                            delay={{show: 250, hide: 400}}
                            overlay={
                                <Tooltip id={`tooltip`}>
                                    Переименовать
                                </Tooltip>
                            }
                        >
                            <input id="file-name" type="text" value={fileName} onChange={handleChange}/>
                        </OverlayTrigger>
                    </Navbar.Text>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse className="justify-content-end">
                        <Nav className="align-items-sm-center gap-3">
                            <Nav.Item>
                                <SplitButton key={'down'} drop={'down'} variant="success" align="end"
                                             className="text-nowrap" title={`Сохранить файл`}
                                             onClick={onSave}>
                                    <Dropdown.Item eventKey="1" onClick={onSavePNG}>Сохранить как SVG</Dropdown.Item>
                                    <Dropdown.Item eventKey="2" onClick={onSavePNG}>Сохранить как PNG</Dropdown.Item>
                                    <Dropdown.Item eventKey="3" onClick={onSavePNG}>Сохранить как JPEG</Dropdown.Item>
                                </SplitButton>
                            </Nav.Item>
                            <Nav.Item>
                                <Button className="text-nowrap" variant="primary" onClick={onRestore}>Загрузить
                                    файл</Button>
                            </Nav.Item>
                            <Nav.Item>
                                <Dropdown onSelect={(e) => e && setThemeMode(e as theme)}>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        Выберите тему
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item eventKey='light'>Светлая</Dropdown.Item>
                                        <Dropdown.Item eventKey='dark'>Тёмная</Dropdown.Item>
                                        <Dropdown.Item eventKey='light_blueprint'>Светлый чертёж</Dropdown.Item>
                                        <Dropdown.Item eventKey='dark_blueprint'>Тёмный чертёж</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav.Item>
                            <Nav.Item>
                                <ToggleButtonGroup id={"lang"} type="radio" name="lang" defaultValue="ru">
                                    {languages.map((lang) => (
                                        <ToggleButton id={lang.name} key={lang.name} value={lang.name} variant="link"
                                                      checked={radioValue === lang.name}
                                                      onChange={(e) => setRadioValue(e.currentTarget.value)}>
                                            <div>
                                                <Image src={lang.img} alt={lang.name} rounded/>
                                            </div>
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <HideButton orientation="bottom" position={{x: 100, y: 86}} handleClick={handleHideHeader}/>
        </header>
    );
}

export default Header;
