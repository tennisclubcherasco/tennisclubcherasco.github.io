import {Card, Container, Row, Col } from "react-bootstrap";
import { Player, Match } from "../utils/types";
import { useEffect, useState } from "react";
import { getLastNMatches } from "../utils/get_data";
import MatchInfo from "../utils/match_info";

const LastMatches: React.FC = () => {
    const [last_matches, setLastMatches] = useState<Match[]>([]);

    useEffect(() => {
        const fetchLastMatches = async () => {
            const matches = await getLastNMatches(5);
            setLastMatches(matches);
        }

        fetchLastMatches();
    }, []);

    return(
        <Container className="d-flex flex-column px-4" style={{}}>
            {last_matches.map((match) => {
                return(
                    <Card className="mb-4" style={{borderRadius:"15px", borderWidth:"2px", borderColor:"#2f7157"}}>
                        <Card.Body className="">
                            <MatchInfo match={match}/>
                        </Card.Body>
                    </Card>
                )
            })}
        </Container>
    )
}

export default LastMatches;