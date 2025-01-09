import {Player, PlayerStats} from "../utils/types";
import {Col, Container, Row} from "react-bootstrap";
import React from "react";
import {Doughnut} from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import ScreenResize from "../utils/screen_resize";

interface PlayerStatsProps {
    player: Player;
    stats: PlayerStats;
}

const PlayerStatistics: React.FC<PlayerStatsProps> = ({ player, stats }) => {
    const isScreenSmall = ScreenResize(600);
    const bottom = ScreenResize(1200);

    ChartJS.register(ArcElement, Tooltip, Legend);

    const donut = {
        data: {
            labels: [],
            datasets: [{
                data: [stats.win, stats.ties, stats.lose],
                backgroundColor: [
                    "#2f7157",
                    "gray",
                    "#991e1e"
                ],
            }],
        },
        options: {
            events: [],
            plugins: {}
        }
    }

    const emptyDonut = {
        data: {
            labels: [],
            datasets: [{
                data: [1]
            }],
        },
        options: {
            events: [],
            plugins: {}
        }
    }

    const graph = stats.matches > 0 ? donut : emptyDonut

    return (
        <Row className={bottom ? "p-0 mx-0" : "p-0 mx-0 mt-5"}>
            <Row className="d-flex justify-content-center mx-0">
                <h2 className="my-font">
                    Statistiche del giocatore
                </h2>
            </Row>
            <Row className="d-flex justify-content-center mx-0 mt-4">
                {!isScreenSmall && <Col className="d-flex flex-column justify-content-between my-font" sm={3}>
                    <Container className="m-0">
                        <h2>
                            Partite:
                        </h2>
                        <h2>
                            {stats.matches}
                        </h2>
                    </Container>
                    <Container className="m-0">
                        <h2>
                            Sconfitte:
                        </h2>
                        <h2 style={{color: "#991e1e"}}>
                            {stats.lose}
                        </h2>
                    </Container>
                </Col>}
                <Col className="d-flex justify-content-center mx-0" xs={isScreenSmall ? 9 : 4}>
                    <Doughnut data={graph.data} options={graph.options}/>
                </Col>
                {!isScreenSmall && <Col className="d-flex flex-column justify-content-between my-font" sm={3}>
                    <Container className="m-0">
                        <h2>
                            Vittorie:
                        </h2>
                        <h2 style={{color:"#2f7157"}}>
                            {stats.win}
                        </h2>
                    </Container>
                    <Container className="m-0">
                        <h2>
                            Pareggi:
                        </h2>
                        <h2 style={{color:"grey"}}>
                            {stats.ties}
                        </h2>
                    </Container>
                </Col>}
                {isScreenSmall &&
                    <><Col className="d-flex flex-column justify-content-between my-font" xs={6}>
                        <Container className="m-0 mt-4">
                            <h2>
                                Partite:
                            </h2>
                            <h2>
                                {stats.matches}
                            </h2>
                        </Container>
                        <Container className="m-0">
                            <h2>
                                Sconfitte:
                            </h2>
                            <h2 style={{color: "#991e1e"}}>
                                {stats.lose}
                            </h2>
                        </Container>
                    </Col>
                    <Col className="d-flex flex-column justify-content-between my-font" xs={6}>
                        <Container className="m-0 mt-4">
                            <h2>
                                Vittorie:
                            </h2>
                            <h2 style={{color:"#2f7157"}}>
                                {stats.win}
                            </h2>
                        </Container>
                        <Container className="mx-0 mt-4">
                            <h2>
                                Pareggi:
                            </h2>
                            <h2 style={{color:"grey"}}>
                                {stats.ties}
                            </h2>
                        </Container>
                    </Col></>
                }
            </Row>
            {/*<Row className="d-flex justify-content-center mx-0 mt-5">*/}
            {/*    */}
            {/*</Row>*/}
        </Row>
    )
}

export default PlayerStatistics;