import {Accordion} from "react-bootstrap";
import {CircuitErrorsType} from "../types.ts";
import Button from "react-bootstrap/Button";

export default function SuggestionDeleteErrors({errors}: {errors: CircuitErrorsType[]}) {

    return (
        <Accordion defaultActiveKey="0">
            {errors.map((error, index) => (
                <Accordion.Item key={index} eventKey={index.toString()}>
                    <Accordion.Header>{error.name}</Accordion.Header>
                    <Accordion.Body style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <p style={{margin: '0'}}>{error.proposal_solution}</p>
                        <Button variant="danger" onClick={error.solution_func}>{error.button_text}</Button>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    )
}