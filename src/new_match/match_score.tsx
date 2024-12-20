import {Alert, Button, Container, Form } from "react-bootstrap";
import { Score } from "../utils/types";
import "../App.css";
import { FormStyle } from "../utils/utility";

interface MatchScoreProps {
    score: Score;
    setScore: React.Dispatch<React.SetStateAction<Score>>;
    isScreenSmall: boolean;
    showAlert: boolean;
    setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const MatchScore: React.FC<MatchScoreProps> = ({ score, setScore, isScreenSmall, showAlert, setShowAlert }) => {
    const addSet = () => {
        const newSet = {
            setNumber: score.length + 1,
            player1: 0,
            player2: 0,
        };
        setScore([...score, newSet]);
    };

    const removeSet = () => {
        const tempScore = score.slice(0, score.length - 1);
        setScore(tempScore);
    };

    return(
        <>
            <Alert className="mb-0 mt-3" show={showAlert} variant="danger" style={{width:"80%"}} onClose={() => setShowAlert(false)} dismissible>
                <h6 className="my-font">
                    Punteggio non valido.
                </h6>
            </Alert>
            {score.map((set) => {
            return (<>
                <h3 className="mt-4 my-font">
                    Set {set.setNumber}
                </h3>
                <Container className="mt-2 d-flex justify-content-center">
                    <Form.Group className="me-4" style={{width:isScreenSmall ? "30%" : "10%"}}>
                        <Form.Select style={FormStyle} value={set.player1} onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 0 && value <= 7) {
                                const newScore = [...score];
                                newScore[set.setNumber - 1].player1 = parseInt(e.target.value);
                                setScore(newScore);
                            }
                        }}>
                            <option value={0}>0</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="ms-4" style={{width:isScreenSmall ? "30%" : "10%"}}>
                        <Form.Select style={FormStyle} onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 0 && value <= 7) {
                                const newScore = [...score];
                                newScore[set.setNumber - 1].player2 = parseInt(e.target.value);
                                setScore(newScore);
                            }
                        }}>
                            <option value={0}>0</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                        </Form.Select>
                    </Form.Group>
                </Container></>
            )
        })}
        <Button className="my-button mt-5 mb-4 me-2" style={{width:isScreenSmall ? "30%" : "12%"}} onClick={() => addSet()}>
            <p className={isScreenSmall ? "my-font h6" : "my-font h5"}>
                Aggiungi set
            </p>
        </Button>
        {score.length > 1 && <Button className="my-button-outlined mt-5 mb-4 ms-2" style={{width: isScreenSmall ? "30%" : "12%"}}
                 onClick={() => removeSet()}>
            <p className={isScreenSmall ? "my-font h6" : "my-font h5"}>
                Rimuovi set
            </p>
        </Button>}</>
    )
}

export default MatchScore;