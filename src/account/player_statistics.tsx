import {Player, PlayerStats} from "../utils/types";
import {Col, Container, Row} from "react-bootstrap";
import React from "react";
import {Doughnut} from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend, Chart,
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

    const textCenter = {
        id: 'textCenter',
        beforeDatasetsDraw(chart: { getDatasetMeta?: any; ctx?: any; data?: any; }, args: any, pluginsOptions: any) {
            const { ctx, data } = chart;
            const winRatio = (stats.win / stats.matches) * 100

            const lines = ['Win ratio:', `${winRatio}%`];

            ctx.save();
            ctx.font = isScreenSmall ? 'bolder 20px Oswald' : 'bolder 20px Oswald';
            ctx.fillStyle = '#2f7157';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const x = chart.getDatasetMeta(0).data[0].x;
            const y = chart.getDatasetMeta(0).data[0].y;

            const lineHeight = 25; // Distanza tra le righe
            lines.forEach((line, index) => {
                ctx.fillText(line, x, y + index * lineHeight - (lines.length - 1) * (lineHeight / 2));
            });

            ctx.restore();
        }
    }

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
            responsive: true,
            events: [],
            plugins: {}
        },
        plugins: [textCenter]
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
        },
        plugins: []
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
                    <Doughnut data={graph.data} options={graph.options} plugins={graph.plugins}/>
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
        </Row>
    )
}

export default PlayerStatistics;