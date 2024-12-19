import {Button, Card, Col, Container, Form, Row } from "react-bootstrap"
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
            <h6 className="my-font mt-2">
                Seleziona la data della partita ed il tuo avversario poi inserisci il risultato e conferma. In caso di partita terminata con un tie break al posto di un eventuale terzo set viene considerato un pareggio.
            </h6>
            <Row className="mt-4 justify-content-center">
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
            </Row>
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
                            <ImageHandler size={isScreenSmall ? 80 : 160} imageUrl={profileImageURL1}/>
                            <p className={isScreenSmall ? "my-font mt-2 h5" : "my-font mt-2 h2"}>
                                {player1?.name} {player1?.surname}
                            </p>
                            <p className={isScreenSmall ? "my-font h6" : "my-font h5"}>
                                Ranked: 12
                            </p>
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
                            <ImageHandler size={isScreenSmall ? 80 : 160} imageUrl={profileImageURL2}/>
                            <p className={isScreenSmall ? "my-font mt-2 h5" : "my-font mt-2 h2"}>
                                {player2 ? player2.name + " " + player2.surname : "Seleziona avversario"}
                            </p>
                            <p className={isScreenSmall ? "my-font h6" : "my-font h5"}>
                                {player2 && "Ranked: "} {player2 && player2.ranking}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12}>
                    <div className={isScreenSmall ? "mt-5 mx-4" : "mt-5 mx-5"} style={{height: "2px", backgroundColor: "#2f7157"}}></div>
                </Col>
                <MatchScore score={score} setScore={setScore} isScreenSmall={isScreenSmall}/>
                <Col xs={12}>
                    <div className={isScreenSmall ? "mt-2 mx-4" : "mt-2 mx-5"} style={{height: "2px", backgroundColor: "#2f7157"}}></div>
                </Col>
                <Button className="my-button mt-3 mb-4" style={{width:isScreenSmall ? "30%" : "12%"}}>
                    <p className={isScreenSmall ? "my-font h6" : "my-font h5"}>
                        Conferma
                    </p>
                </Button>
            </Row>
        </Container>
    )
}

export default NewMatch