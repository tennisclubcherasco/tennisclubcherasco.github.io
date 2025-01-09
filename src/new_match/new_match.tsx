import {Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap"
import MyNavbar from "../navbar/navbar"
import { useAuth } from "../AuthContext";
import React, {useEffect, useState } from "react";
import { fetchProfileImage, getAllUsers, getUser } from "../utils/get_data";
import { ImageHandler } from "../utils/image_handler";
import ScreenResize from "../utils/screen_resize";
import { Player, Score } from "../utils/types";
import MatchScore from "./match_score";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import {addDoc, collection, doc, updateDoc} from "firebase/firestore";
import {calcPlayerScore, getWinner, UpdateRanking} from "../utils/score_ranking";
import {newMatch} from "../utils/set_data";

const NewMatch = () => {
    const navigate = useNavigate();
    const {currentUser} = useAuth();
    const [showModal, setShowModal] = useState<boolean>(false);
    const isScreenSmall = ScreenResize(900);
    const smallForm = ScreenResize(1200);
    const cardMargin = ScreenResize(1300);
    const modalSize = ScreenResize(400);
    const [updating, setUpdating] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [player1, setPlayer1] = useState<any>(null);
    const [player2, setPlayer2] = useState<any>(null);
    const [date, setDate] = useState<string>("");
    const [score, setScore] = useState<Score>([{setNumber: 1, player1: 0, player2: 0}]);
    const [showAlert, setShowAlert] = useState<boolean>(false);

    const [profileImageURL1, setProfileImageURL1] = useState<string | null>(null);
    const [profileImageURL2, setProfileImageURL2] = useState<string | null>(null);

    const [formErrors, setFormErrors] = useState({
        date: "",
        player2: ""
    });

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
                        await loadProfileImage(userData.profileImage);
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

    const handleSubmit = () => {
        let formErrors = {
            date: "",
            player2: "",
        };
        let formValid = true

        if (date === "") {
            formErrors.date = "Inserisci una data";
            formValid = false;
        }

        if (date > new Date().toISOString().split('T')[0]) {
            formErrors.date = "Inserisci una data valida";
            formValid = false;
        }

        if (player2 == null) {
            formErrors.player2 = "Seleziona un avversario";
            formValid = false;
        }

        for (let i = 0; i < score.length; i++) {
            if (score[i].player1 === 0 && score[i].player2 === 0) {
                setShowAlert(true);
                formValid = false;
            }
        }

        if (formValid) {
            setShowModal(true)
        } else {
            setFormErrors(formErrors)
        }
    }

    const createNewMatch = async () => {
        setShowModal(false);
        setUpdating(true);
        setShowLoading(true);

        try {
            newMatch(player1, player2, score, date);
            setUpdating(false);
        } catch (e) {
            console.error("Error adding match: ", e);
            setUpdating(false);
            setShowLoading(false);
        }
    }

    return (
        <Container fluid style={{width: "100%"}} className="d-flex flex-column justify-content-center text-center m-0 p-0">
            <MyNavbar/>
            <h1 className="my-font mt-5">
                Inserisci un nuovo risultato
            </h1>
            <h6 className="my-font mt-2">
                Seleziona la data della partita ed il tuo avversario poi inserisci il risultato e conferma. In caso di partita terminata con un tie break al posto di un eventuale terzo set viene considerato un pareggio.
            </h6>
            <Modal show={showLoading} centered className="my-modal">
                <Modal.Body>
                    <h5 className="my-font">
                        {updating ? "Aggiungendo i punteggi..." : "Punteggi aggiornati con successo!"}
                    </h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={updating} className="my-button" variant="primary"
                            style={{
                                width: isScreenSmall ? '50%' : '20%',
                                minHeight: '40px',
                            }}
                            onClick={() => navigate(`/main`)}>
                        <h6 className="my-font" style={{ pointerEvents: "none" }}>
                            chiudi
                        </h6>
                    </Button>
                </Modal.Footer>
            </Modal>
            {showModal &&
                <Modal show={showModal} centered className="">
                    <Modal.Header>
                        <h4 className="my-font">
                            Vuoi aggiungere questa partita?
                        </h4>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="d-flex align-items-center">
                            <Col className={modalSize ? "ms-0" : "ms-4"} xs={6}>
                                <h5 className="my-font">
                                    {player1.name + " " + player1.surname}
                                </h5>
                            </Col>
                            <Col xs={5}>
                                <Row>
                                    {score.map((set) => {
                                        const win = set.player1 > set.player2
                                        return (
                                            <Col xs={2}>
                                                <h5 style={{fontWeight: win ? "bold" : "", color: win ? "#2f7157" : "black"}}>
                                                    {set.player1}
                                                </h5>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Col>
                        </Row>
                        <Col xs={12}>
                            <div className={isScreenSmall ? "my-2 mx-1" : "my-2 mx-2"} style={{height: "2px", backgroundColor: "#2f7157"}}></div>
                        </Col>
                        <Row className="d-flex align-items-center">
                            <Col className={modalSize ? "ms-0" : "ms-4"} xs={6}>
                                <h5 className="my-font">
                                    {player2.name + " " + player2.surname}
                                </h5>
                            </Col>
                            <Col xs={5}>
                                <Row>
                                    {score.map((set) => {
                                        const win = set.player1 < set.player2
                                        return (
                                            <Col xs={2}>
                                                <h5 style={{fontWeight: win ? "bold" : "", color: win ? "#2f7157" : "black"}}>
                                                    {set.player2}
                                                </h5>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-center">
                        <Button className="p-0 my-button" variant="primary"
                                style={{
                                    width: isScreenSmall ? '30%' : '20%',
                                    minHeight: '40px',
                                }}
                                onClick={() => createNewMatch()}>
                            <h6 className="my-font" style={{pointerEvents: "none"}}>
                                Conferma
                            </h6>
                        </Button>
                        <Button className="p-0 my-button-outlined" variant="primary"
                                style={{
                                    width: isScreenSmall ? '30%' : '20%',
                                    minHeight: '40px',
                                }}
                                onClick={() => setShowModal(false)}>
                            <h6 className="my-font" style={{pointerEvents: "none"}}>
                                Indietro
                            </h6>
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
            <Row className="mt-4 mx-0 justify-content-center">
                <Col xs={isScreenSmall ? 5 : 4}>
                    <Form.Group className={smallForm ? "mt-2" : "mt-2 mx-5"}>
                        <Form.Label className="my-font">Data</Form.Label>
                        <Form.Control
                            style={{borderRadius:"40px", border:"solid", borderWidth:"2px", borderColor:"#24644c"}}
                            type="date"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value)
                                setFormErrors((prevErrors) => ({
                                    ...prevErrors,
                                    date: ""
                                }));
                            }}
                            isInvalid={!!formErrors.date}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors.date}
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
                                if (rival) {
                                    setFormErrors((prevErrors) => ({
                                        ...prevErrors,
                                        player2: ""
                                    }));
                                }
                            }}
                            isInvalid={!!formErrors.player2}
                        >
                            <option>Seleziona avversario...</option>
                            {allPlayers
                                .filter((player) => player.uid !== currentUser.uid)
                                .sort((p1, p2) => {
                                    if (p1.surname > p2.surname) return 1;
                                    if (p1.surname < p2.surname) return -1;
                                    return p1.name > p2.name ? 1 : -1;
                                })
                                .map((player) => (<option key={player.uid} value={player.uid}>{player.surname} {player.name}</option>))
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {formErrors.player2}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center mt-5 mx-0">
                <Col className="ms-0 p-0 justify-content-center" xs={isScreenSmall ? 5 : 3}>
                    <Card className={cardMargin ? "h-100 mx-0" : "h-100 mx-5"} style={{
                        borderRadius:"40px",
                        color:"#2f7157",
                        backgroundColor:"rgba(209,255,230,0.7)",
                        border:"solid",
                        borderWidth:"5px",
                        borderColor:"#24644c"
                    }}>
                        <Card.Body className="px-1 d-flex flex-column align-items-center">
                            <ImageHandler size={isScreenSmall ? 80 : 160} imageUrl={profileImageURL1} backColor={"#2f7157"}/>
                            <p className={isScreenSmall ? "my-font mt-2 h5" : "my-font mt-2 h2"}>
                                {player1?.name} {player1?.surname}
                            </p>
                            <p className={isScreenSmall ? "my-font h6" : "my-font h5"}>
                                {player1 && "Ranked: "} {player1 && player1.ranking}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="d-flex justify-content-center align-items-center mx-1" xs={1}>
                    <h2 className="my-font">
                        VS
                    </h2>
                </Col>
                <Col className="me-0 p-0" xs={isScreenSmall ? 5 : 3}>
                    <Card className={cardMargin ? "h-100 mx-0" : "h-100 mx-5"} style={{
                        borderRadius:"40px",
                        color:"#2f7157",
                        backgroundColor:"rgba(209,255,230,0.7)",
                        border:"solid",
                        borderWidth:"5px",
                        borderColor:"#24644c"
                    }}>
                        <Card.Body className="px-1 d-flex flex-column align-items-center">
                            <ImageHandler size={isScreenSmall ? 80 : 160} imageUrl={profileImageURL2} backColor={"#2f7157"}/>
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
                <MatchScore score={score} setScore={setScore} isScreenSmall={isScreenSmall} showAlert={showAlert} setShowAlert={setShowAlert}/>
                <Col xs={12}>
                    <div className={isScreenSmall ? "mt-2 mx-4" : "mt-2 mx-5"} style={{height: "2px", backgroundColor: "#2f7157"}}></div>
                </Col>
                <Button className="my-button mt-3 mb-4" style={{width:isScreenSmall ? "30%" : "12%"}} onClick={() => handleSubmit()}>
                    <p className={isScreenSmall ? "my-font h6" : "my-font h5"}>
                        Conferma
                    </p>
                </Button>
            </Row>
        </Container>
    )
}

export default NewMatch