import {Card, Container, Row, Col } from "react-bootstrap";
import { players, matches } from "../utils/static_data";
import { Player, Match } from "../utils/types";

const LastMatches: React.FC = () => {

    const last_matches = matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

    const MatchScore: React.FC<{match: Match}> = ({match}) => {
        const player1 = players.find(player => player.id === match.player1ID)
        const player2 = players.find(player => player.id === match.player2ID)
        if(player1 === undefined || player2 === undefined) return null

        const sets = match.score.split(', ')
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

        return(
            <><Row className="d-flex justify-content-between mb-2">
                <Col sm={7} className="d-flex align-items-center pe-0">
                    <p className="my-font m-0 text-start" style={{fontSize: "1.0em"}}>
                        {player1.nome + " " + player1.cognome}
                    </p>
                </Col>
                <Col sm={5} className="d-flex align-items-center p-0">
                    {player1_score.map((score, index) => {
                        return (
                            <p className="me-2 mb-0" style={{ fontWeight: set_winner[index] == 1 ? "bold" : ""}}>{score}</p>
                        )
                    })}
                </Col>
            </Row>
            <Row className="d-flex justify-content-between">
                <Col sm={7} className="d-flex align-items-center pe-0">
                    <p className="my-font m-0 text-start" style={{fontSize: "1.0em"}}>
                        {player2.nome + " " + player2.cognome}
                    </p>
                </Col>
                <Col sm={5} className="d-flex align-items-center p-0">
                    {player2_score.map((score, index) => {
                        return (
                            <p className="me-2 mb-0" style={{ fontWeight: set_winner[index] == 2 ? "bold" : ""}}>{score}</p>
                        )
                    })}
                </Col>
            </Row></>
        )
    }

    return(
        <Container className="d-flex flex-column px-4" style={{}}>
            {last_matches.map((match) => {
                return(
                    <Card className="mb-4">
                        <Card.Body className="">
                            <MatchScore match={match}/>
                        </Card.Body>
                    </Card>
                )
            })}
        </Container>
    )
}

export default LastMatches;