import {Player, PlayerStats} from "../utils/types";
import React from "react";
import {Row} from "react-bootstrap";

interface PlayerLastMatchesProps {
    player: Player;
    stats: PlayerStats;
}

const PlayerLastMatches: React.FC<PlayerLastMatchesProps> = ({ player, stats }) => {
    return (
        <Row className="p-0 mx-0">
            <Row className="d-flex justify-content-center mx-0">
                <h2 className="my-font">
                    Ultime partite giocate
                </h2>
            </Row>
        </Row>
    )
}

export default PlayerLastMatches