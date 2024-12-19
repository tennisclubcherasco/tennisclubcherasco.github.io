import {Button, Container, Form } from "react-bootstrap";
import { Score } from "../utils/types";

interface MatchScoreProps {
    score: Score;
    setScore: React.Dispatch<React.SetStateAction<Score>>;
    isScreenSmall: boolean;
}

const MatchScore: React.FC<MatchScoreProps> = ({ score, setScore, isScreenSmall }) => {
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
        <>{score.map((set) => {
            return (<>
                <h3 className="mt-4 my-font">
                    Set {set.setNumber}
                </h3>
                <Container className="mt-2 d-flex justify-content-center">
                    <Form.Group className="me-4" style={{width:isScreenSmall ? "30%" : "10%"}}>
                        <Form.Control min={0} max={7} type="number" style={{borderRadius:"40px", border:"solid", borderWidth:"2px", borderColor:"#24644c"}} value={set.player1} onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 0 && value <= 7) {
                                const newScore = [...score];
                                newScore[set.setNumber - 1].player1 = parseInt(e.target.value);
                                setScore(newScore);
                            }
                        }}/>
                    </Form.Group>
                    <Form.Group className="ms-4" style={{width:isScreenSmall ? "30%" : "10%"}}>
                        <Form.Control min={0} max={7} type="number" style={{borderRadius:"40px", border:"solid", borderWidth:"2px", borderColor:"#24644c"}} value={set.player2} onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 0 && value <= 7) {
                                const newScore = [...score];
                                newScore[set.setNumber - 1].player2 = parseInt(e.target.value);
                                setScore(newScore);
                            }
                        }}/>
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