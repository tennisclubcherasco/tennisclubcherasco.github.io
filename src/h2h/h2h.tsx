import {useParams} from "react-router-dom";
import MyNavbar from "../navbar/navbar";
import {Col, Container, Form, Row} from "react-bootstrap";
import {ImageHandler} from "../utils/image_handler";
import React, {useEffect, useState} from "react";
import ScreenResize from "../utils/screen_resize";
import {fetchProfileImage, getAllUsers, getH2H, getUser} from "../utils/get_data";
import {useAuth} from "../AuthContext";
import {H2H, Player} from "../utils/types";
import {Doughnut} from "react-chartjs-2";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";

function HEAD2HEAD() {
    const {currentUser} = useAuth();
    const isScreenSmall = ScreenResize(600);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    
    const [player1, setPlayer1] = useState<any>(null);
    const [player2, setPlayer2] = useState<any>(null);
    const [p1ID, setP1ID] = useState(currentUser.uid);
    const [p2ID, setP2ID] = useState(useParams<{player2ID: string | undefined}>().player2ID);
    const [h2h, setH2H] = useState<H2H | undefined>(undefined);

    const [profileImageURL1, setProfileImageURL1] = useState<string | null>(null);
    const [profileImageURL2, setProfileImageURL2] = useState<string | null>(null);

    ChartJS.register(ArcElement, Tooltip, Legend);

    const loadProfileImage = async (imageURL: string) => {
        return await fetchProfileImage(imageURL);
    };

    const fetchUserData = async (userId: string, setPlayer: (player: Player | null) => void, setImage: (url: string | null) => void) => {
        if (!userId) return;

        try {
            const userData = await getUser(userId);
            setPlayer(userData);

            if (userData?.profileImage) {
                const imageUrl = await loadProfileImage(userData.profileImage);
                if(imageUrl) setImage(imageUrl);
            } else {
                setImage(null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        getAllUsers().then(setAllPlayers).catch(console.error);
    }, []);

    useEffect(() => {
        fetchUserData(p1ID, setPlayer1, setProfileImageURL1);
    }, [p1ID]);

    useEffect(() => {
        if (p2ID) {
            fetchUserData(p2ID, setPlayer2, setProfileImageURL2);
        }
    }, [p2ID]);

    useEffect(() => {
        const loadH2H = async () => {
            if (p1ID && p2ID) {
                const head2head = await getH2H(p1ID, p2ID);
                console.log(head2head);
                setH2H(head2head);
            }
        };

        loadH2H();
    }, [p1ID, p2ID]);

    const donut = {
        data: {
            labels: [],
            datasets: [{
                data: [h2h?.winsP1, h2h?.ties, h2h?.winsP2],
                backgroundColor: [
                    "#2f7157",
                    "gray",
                    "#991e1e"
                ],
            }],
        },
        options: {
            responsive: false,
            events: [],
            plugins: {}
        },
        plugins: []
    }

    const emptyDonut = {
        data: {
            labels: [],
            datasets: [{
                data: [1],
                backgroundColor: ["gray",],
            }],
        },
        options: {
            responsive: false,
            events: [],
            plugins: {}
        },
        plugins: []
    }

    const graph = h2h !== undefined ? donut : emptyDonut

    return(
        <Container fluid style={{width: "100%"}} className="d-flex flex-column justify-content-center text-center m-0 p-0">
            <MyNavbar/>
            <h1 className="my-font mt-5">
                Testa a testa
            </h1>
            <Row className={isScreenSmall ? "d-flex justify-content-between mt-5 mx-0" : "d-flex justify-content-center mt-5 mx-0"}>
                <Col className="ms-0 p-0 justify-content-top align-items-center flex-column d-flex" xs={isScreenSmall ? 5 : 4}>
                    <Form.Group className="mb-3">
                        <Form.Select
                            style={{width:"100px", borderRadius:"40px", border:"solid", borderWidth:"2px", borderColor:"#24644c"}}
                            onChange={(e) => {
                                const player = allPlayers.find((player) => player.uid === e.target.value);
                                if(player) setP1ID(player.uid);
                            }}
                        >
                            <option>Cerca</option>
                            {allPlayers
                                .filter((player) => {
                                        const player1Id = player1?.uid;
                                        const player2Id = player2?.uid;
                                        return player.uid !== player1Id && player.uid !== player2Id;
                                })
                                .sort((p1, p2) => {
                                    if (p1.surname > p2.surname) return 1;
                                    if (p1.surname < p2.surname) return -1;
                                    return p1.name > p2.name ? 1 : -1;
                                })
                                .map((player) => (<option key={player.uid} value={player.uid}>{player.surname} {player.name}</option>))
                            }
                        </Form.Select>
                    </Form.Group>
                    <ImageHandler size={isScreenSmall ? 80 : 160} imageUrl={profileImageURL1} backColor={"#2f7157"}/>
                    <p className={isScreenSmall ? "my-font mt-2 h5" : "my-font mt-2 h2"}>
                        {player1?.name} {player1?.surname}
                    </p>
                    <p className={isScreenSmall ? "my-font h6" : "my-font h5"}>
                        {player1 && "Ranked: "} {player1 && player1.ranking}
                    </p>
                </Col>
                {!isScreenSmall && <Col className="d-flex flex-column justify-content-center align-items-center mx-1" sm={3}>
                    <h1 className="my-font mt-3">
                        {h2h ? `${h2h.winsP1} - ${h2h.winsP2}` : "0 - 0"}
                    </h1>
                    <Doughnut data={graph.data} options={graph.options} plugins={graph.plugins}/>
                    <h1 className="my-font mt-3">
                        {h2h ? `${h2h.ties} pareggi` : "0 pareggi"}
                    </h1>
                </Col>}
                <Col className="ms-0 p-0 justify-content-top align-items-center flex-column d-flex" xs={isScreenSmall ? 5 : 4}>
                    <Form.Group className="mb-3">
                        <Form.Select
                            style={{width:"100px", borderRadius:"40px", border:"solid", borderWidth:"2px", borderColor:"#24644c"}}
                            onChange={(e) => {
                                const player = allPlayers.find((player) => player.uid === e.target.value);
                                if(player) setP2ID(player.uid);
                            }}
                        >
                            <option>Cerca</option>
                            {allPlayers
                                .filter((player) => {
                                    const player1Id = player1?.uid;
                                    const player2Id = player2?.uid;
                                    return player.uid !== player1Id && player.uid !== player2Id;
                                })
                                .sort((p1, p2) => {
                                    if (p1.surname > p2.surname) return 1;
                                    if (p1.surname < p2.surname) return -1;
                                    return p1.name > p2.name ? 1 : -1;
                                })
                                .map((player) => (<option key={player.uid} value={player.uid}>{player.surname} {player.name}</option>))
                            }
                        </Form.Select>
                    </Form.Group>
                    <ImageHandler size={isScreenSmall ? 80 : 160} imageUrl={profileImageURL2} backColor={"#991e1e"}/>
                    <p className={isScreenSmall ? "my-font mt-2 h5" : "my-font mt-2 h2"}>
                        {player2 ? player2.name + " " + player2.surname : "Seleziona avversario"}
                    </p>
                    <p className={isScreenSmall ? "my-font h6" : "my-font h5"}>
                        {player2 && "Ranked: "} {player2 && player2.ranking}
                    </p>
                </Col>
            </Row>
            {isScreenSmall && <Col className="d-flex flex-column justify-content-center align-items-center mx-1" sm={3}>
                <h1 className="my-font mt-3">
                    {h2h ? `${h2h.winsP1} - ${h2h.winsP2}` : "0 - 0"}
                </h1>
                <Doughnut data={graph.data} options={graph.options} plugins={graph.plugins}/>
                <h1 className="my-font mt-3">
                    {h2h ? `${h2h.ties} pareggi` : "0 pareggi"}
                </h1>
            </Col>}
        </Container>
    )
}

export default HEAD2HEAD;