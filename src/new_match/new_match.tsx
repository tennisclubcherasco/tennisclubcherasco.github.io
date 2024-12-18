import {Card, Col, Container, Form, Row } from "react-bootstrap"
import MyNavbar from "../navbar/navbar"
import { useAuth } from "../AuthContext";
import {useEffect, useState } from "react";
import {downloadImageFromStorage, fetchProfileImage, getAllUsers, getUser } from "../utils/get_data";
import { ImageHandler } from "../utils/image_handler";
import ScreenResize from "../utils/screen_resize";
import { Player, Score } from "../utils/types";
import MatchScore from "./match_score";

const NewMatch = () => {
    const {currentUser} = useAuth();
    const isScreenSmall = ScreenResize(900)
    const smallForm = ScreenResize(1200)
    const cardMargin = ScreenResize(1300)

    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [player1, setPlayer1] = useState<any>(null);
    const [player2, setPlayer2] = useState<any>(null);
    const [date, setDate] = useState<string>("");
    const [score, setScore] = useState<Score>([{setNumber: 1, player1: 0, player2: 0}]);

    const [profileImageURL1, setProfileImageURL1] = useState<string | null>(null);
    const [profileImageURL2, setProfileImageURL2] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllUsers = async () => {
            const users = await getAllUsers();
            setAllPlayers(users);
        };

        fetchAllUsers();
    }, []);

    useEffect(() => {
        const loadProfileImage = async (imageURL: string) => {
            const downloadURL = await fetchProfileImage(imageURL);
            if(downloadURL) setProfileImageURL1(downloadURL);
        }

        const fetchUser = async () => {
            if (currentUser.uid) {
                try {
                    const userData = await getUser(currentUser.uid);
                    setPlayer1(userData);

                    if (userData?.profileImage) {
                        loadProfileImage(userData.profileImage);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUser();
    }, [currentUser.uid]);

    useEffect(() => {
        if (player2) {
            const loadProfileImage = async (imageURL: string) => {
                const downloadURL = await fetchProfileImage(imageURL);
                if(downloadURL) setProfileImageURL2(downloadURL);
            }

            loadProfileImage(player2.profileImage);
        } else {
            setProfileImageURL2(null);
        }
    }, [player2]);

    return (
        <Container fluid style={{width: "100%"}} className="d-flex flex-column justify-content-center text-center m-0 p-0">
            <MyNavbar/>
            <h1 className="my-font mt-5">
                Inserisci un nuovo risultato
            </h1>
            <Row className="d-flex justify-content-center mt-5">
                <Col className="ms-0 p-0" xs={isScreenSmall ? 4 : 3}>
                    <Card className={cardMargin ? "h-100 mx-0" : "h-100 mx-5"} style={{
                        borderRadius:"40px",
                        color:"#2f7157",
                        backgroundColor:"rgba(209,255,230,0.7)",
                        border:"solid",
                        borderWidth:"5px",
                        borderColor:"#24644c"
                    }}>
                        <Card.Body>
                            <ImageHandler size={isScreenSmall ? 110 : 160} imageUrl={profileImageURL1}/>
                            <h2 className="my-font mt-2">
                                {player1?.name} {player1?.surname}
                            </h2>
                            <h5 className="my-font">
                                Ranked: 12
                            </h5>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="d-flex justify-content-center align-items-center mx-3" xs={1}>
                    <h1 className="my-font">
                        VS
                    </h1>
                </Col>
                <Col className="me-0 p-0" xs={isScreenSmall ? 4 : 3}>
                    <Card className={cardMargin ? "h-100 mx-0" : "h-100 mx-5"} style={{
                        borderRadius:"40px",
                        color:"#2f7157",
                        backgroundColor:"rgba(209,255,230,0.7)",
                        border:"solid",
                        borderWidth:"5px",
                        borderColor:"#24644c"
                    }}>
                        <Card.Body>
                            <ImageHandler size={isScreenSmall ? 110 : 160} imageUrl={profileImageURL2}/>
                            <h2  className="my-font mt-2">
                                {player2 ? player2.name + " " + player2.surname : "Seleziona avversario"}
                            </h2>
                            <h5 className="my-font">
                                {player2 && "Ranked: "} {player2 && player2.ranking}
                            </h5>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-5 justify-content-center">
                <Col xs={isScreenSmall ? 5 : 4}>
                    <Form.Group className={smallForm ? "mt-2" : "mt-2 mx-5"}>
                        <Form.Label className="my-font">Data</Form.Label>
                        <Form.Control
                            style={{borderRadius:"40px", border:"solid", borderWidth:"2px", borderColor:"#24644c"}}
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            // isInvalid={!!formErrors.birthDate}
                        />
                        <Form.Control.Feedback type="invalid">
                            {/*{formErrors.birthDate}*/}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col xs={isScreenSmall ? 5 : 4}>
                    <Form.Group className={smallForm ? "mt-2" : "mt-2 mx-5"}>
                        <Form.Label className="my-font">Avversario</Form.Label>
                        <Form.Select
                            style={{borderRadius:"40px", border:"solid", borderWidth:"2px", borderColor:"#24644c"}}
                            onChange={(e) => {
                                const rival = allPlayers.find((player) => player.uid === e.target.value);
                                setPlayer2(rival);
                            }}>
                            <option>Seleziona avversario...</option>
                            {allPlayers.filter((player) => player.uid != currentUser.uid).map((player) => (
                                <option key={player.uid} value={player.uid}>{player.name} {player.surname}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <MatchScore score={score} setScore={setScore}/>
            </Row>
        </Container>
    )
}

export default NewMatch