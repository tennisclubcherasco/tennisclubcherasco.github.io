import {Player, PlayerStats, Match} from "../utils/types";
import React, {useEffect, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import "./account.css";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import {getPlayerMatches} from "../utils/get_data";
import MatchCard from "./match_card";

interface PlayerLastMatchesProps {
    player: Player;
    stats: PlayerStats;
}

const PlayerLastMatches: React.FC<PlayerLastMatchesProps> = ({ player, stats }) => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchMatches = async () => {
            const result = await getPlayerMatches(player.uid);
            setMatches(result);
        };

        fetchMatches();
    }, []);

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === matches.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? matches.length - 1 : prevIndex - 1
        );
    };

    if(matches.length > 0) {
        return (
            <Row className="p-0 mx-0">
                <Row className="d-flex justify-content-center mx-0">
                    <h2 className="my-font">
                        Ultime partite giocate
                    </h2>
                </Row>
                <Col className="slider-container">
                    <Button className="p-0 circle-btn my-button arrow left" onClick={handlePrev}>
                        <FaArrowLeft/>
                    </Button>
                    <Col className="slider">
                        <Col
                            className="slider-inner"
                            style={{
                                transform: `translateX(-${currentIndex * 100}%)`,
                            }}
                        >
                            {matches.map((item) => (
                                <MatchCard match={item} player1={player}/>
                            ))}
                        </Col>
                    </Col>
                    <Button className="p-0 circle-btn my-button arrow right" onClick={handleNext}>
                        <FaArrowRight/>
                    </Button>
                </Col>
            </Row>
        )
    } else {
        return (
            <Row className="p-0 mx-0">
                <Row className="d-flex justify-content-center mx-0">
                    <h2 className="my-font">
                        Ultime partite giocate
                    </h2>
                </Row>
                <Row className="mt-5">
                    <h4 className="my-font">
                        {player.name} {player.surname} non ha ancora giocato alcuna partita
                    </h4>
                </Row>
            </Row>
        )
    }

}

export default PlayerLastMatches