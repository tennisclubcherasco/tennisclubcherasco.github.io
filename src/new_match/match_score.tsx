import {Button, Container, Form } from "react-bootstrap";
import { Score } from "../utils/types";

interface MatchScoreProps {
    score: Score;
    setScore: React.Dispatch<React.SetStateAction<Score>>;
}

const MatchScore: React.FC<MatchScoreProps> = ({ score, setScore }) => {
    const addSet = () => {
        const newSet = {
            setNumber: score.length + 1,
            player1: 0,
            player2: 0,
        };
        setScore([...score, newSet]);
    };

    return(
        <>{score.map((set) => {
            return (<>
                <h3 className="mt-4 my-font">
                    Set {set.setNumber}
                </h3>
                <Container className="mt-2 d-flex justify-content-center">
                    <Form.Group className="me-4">
                        <Form.Control type="number" style={{borderRadius:"40px", border:"solid", borderWidth:"2px", borderColor:"#24644c"}} value={set.player1} onChange={(e) => {
                            const newScore = [...score];
                            newScore[set.setNumber - 1].player1 = parseInt(e.target.value);
                            setScore(newScore);
                        }}/>
                    </Form.Group>
                    <Form.Group className="ms-4">
                        <Form.Control type="number" style={{borderRadius:"40px", border:"solid", borderWidth:"2px", borderColor:"#24644c"}} value={set.player2} onChange={(e) => {
                            const newScore = [...score];
                            newScore[set.setNumber - 1].player2 = parseInt(e.target.value);
                            setScore(newScore);
                        }}/>
                    </Form.Group>
                </Container></>
            )
        })}
        <Button className="my-button mt-4" style={{width:"30%"}} onClick={() => addSet()}>
            <h3 className="my-font">
                Aggiungi set
            </h3>
        </Button></>
    )
}

export default MatchScore;