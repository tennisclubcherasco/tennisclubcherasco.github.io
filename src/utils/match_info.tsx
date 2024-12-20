import {useEffect, useState } from "react";
import {Match, Player } from "./types";
import { getUser } from "./get_data";
import {Col, Row } from "react-bootstrap";

interface MatchScoreProps {
    match: Match;
}

const MatchInfo: React.FC<MatchScoreProps> = ({match}) => {
    const [player1, setPlayer1] = useState<Player | null>(null);
    const [player2, setPlayer2] = useState<Player | null>(null)

    useEffect(() => {
        const fetchPlayers = async () => {
            const p1 = await getUser(match.player1ID);
            const p2 = await getUser(match.player2ID);
            if (p1 && p2){
                setPlayer1(p1);
                setPlayer2(p2);
            } else {
                console.error("error fetching players")
            }
        }

        fetchPlayers()
    }, []);

    const sets = match.score.split(' ')
    let player1_score: Array<String> = []
    let player2_score: Array<String> = []
    let set_winner: number[] = []
    sets.forEach(set => {
        const scores = set.split('-')
        player1_score.push(scores[0])
        player2_score.push(scores[1])
        if(parseInt(scores[0]) > parseInt(scores[1])) set_winner.push(1)
        else set_winner.push(2)
    })

    if (player1 && player2) {
        return (
            <>
            <Row className="d-flex justify-content-start  mb-2">
                <Col sm={7} className="d-flex align-items-center pe-0">
                    <p className="my-font m-0 text-start" style={{fontSize: "1em"}}>
                        {match.date}
                    </p>
                </Col>
            </Row>
            <Row className="d-flex justify-content-between mb-2">
                <Col sm={7} className="d-flex align-items-center pe-0">
                    <p className="my-font m-0 text-start" style={{fontSize: "1.2em"}}>
                        {player1.name + " " + player1.surname}
                    </p>
                </Col>
                <Col sm={5} className="d-flex align-items-center p-0">
                    {player1_score.map((score, index) => {
                        return (
                            <p className="me-2 mb-0" style={{ fontWeight: set_winner[index] == 1 ? "bold" : "", color: set_winner[index] == 1 ? "#2f7157" : "black"}}>{score}</p>
                        )
                    })}
                </Col>
            </Row>
            <Col xs={12}>
                <div className="my-2 mx-1" style={{height: "2px", backgroundColor: "#2f7157"}}></div>
            </Col>
            <Row className="d-flex justify-content-between">
                <Col sm={7} className="d-flex align-items-center pe-0">
                    <p className="my-font m-0 text-start" style={{fontSize: "1.2em"}}>
                        {player2.name + " " + player2.surname}
                    </p>
                </Col>
                <Col sm={5} className="d-flex align-items-center p-0">
                    {player2_score.map((score, index) => {
                        return (
                            <p className="me-2 mb-0" style={{ fontWeight: set_winner[index] == 2 ? "bold" : "", color: set_winner[index] == 2 ? "#2f7157" : "black"}}>{score}</p>
                        )
                    })}
                </Col>
            </Row></>
        )
    } else {
        return (
            <></>
        )
    }
}

export default MatchInfo;