import {Button, Col, Container, Row } from "react-bootstrap";
import MyNavbar from "../navbar/navbar";
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { downloadImageFromStorage, fetchProfileImage, getStats, getUser } from "../utils/get_data";
import { useAuth } from "../AuthContext";
import ScreenResize from "../utils/screen_resize";
import EditButton from "./edit_button";
import { ImageHandler } from "../utils/image_handler";
import {Player, PlayerStats} from "../utils/types";
import PlayerStatistics from "./player_statistics";
import PlayerLastMatches from "./player_last_matches";

function PlayerAccount() {
    const isScreenSmall = ScreenResize(1200)
    const navigate = useNavigate();
    const { userId } = useParams<{userId: string}>();
    const {currentUser, loading} = useAuth();
    const [user, setUser] = useState<Player>();
    const [stats, setStats] = useState<PlayerStats>();
    const [profileImageURL, setProfileImageURL] = useState<string | null>(null);

    useEffect(() => {
        const loadProfileImage = async (imageURL: string) => {
            const downloadURL = await fetchProfileImage(imageURL);
            if(downloadURL) setProfileImageURL(downloadURL);
        }

        const fetchUser = async () => {
            if (userId) {
                try {
                    const userData = await getUser(userId);
                    const statsData = await getStats(userId);
                    if (userData) setUser(userData);
                    if (statsData) setStats(statsData);

                    if (userData?.profileImage) {
                        await loadProfileImage(userData.profileImage);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUser();
    }, [userId]);

    if (user != null && stats != null) {
        return (
            <>
            <MyNavbar/>
            <Container fluid style={{minHeight: '78vh', width: "100%"}} className="d-flex text-center m-0 p-0">
                <Container fluid className="p-0 d-flex" style={{}}>
                    <Row className="flex-grow-1 p-0 m-0">
                        <Col className="py-0 my-2 d-flex flex-column" sm={isScreenSmall ? 12 : 4} style={{borderRight: isScreenSmall ? "" : "2px solid #2f7157"}}>
                            <Container fluid className="d-flex justify-content-center mt-5">
                                <ImageHandler size={160} imageUrl={profileImageURL} backColor={"#2f7157"}/>
                            </Container>
                            <h1 className="my-font mt-3">{user.name} {user.surname}</h1>
                            <Container className="d-flex flex-column mt-4">
                                <Row className="mt-3">
                                    <Col className="" xs={6}>
                                        <h4 className="my-font">Ranking attuale:</h4>
                                        <h2 className="my-font" style={{color:"#2f7157"}}>{user.ranking}</h2>
                                    </Col>
                                    <Col className="" xs={6}>
                                        <h4 className="my-font">Best Ranking:</h4>
                                        <h2 className="my-font" style={{color:"#2f7157"}}>{user.bestRanking}</h2>
                                    </Col>
                                </Row>
                                <Row className="mt-5">
                                    <Col className="" xs={6}>
                                        <h4 className="my-font">Lato diritto:</h4>
                                        <h3 className="my-font" style={{color:"#2f7157"}}>{user.forehand}</h3>
                                    </Col>
                                    <Col className="" xs={6}>
                                        <h4 className="my-font">Colpo preferito:</h4>
                                        <h3 className="my-font" style={{color:"#2f7157"}}>{user.bestShot}</h3>
                                    </Col>
                                </Row>
                                <Row className="mt-5">
                                    <Col className="">
                                        <h4 className="my-font">Email:</h4>
                                        <h3 className="my-font" style={{color:"#2f7157"}}>{user.email}</h3>
                                    </Col>
                                </Row>
                                <Row className="mt-5">
                                    <Col className="">
                                        <h4 className="my-font">Telefono:</h4>
                                        <h3 className="my-font" style={{color:"#2f7157"}}>{user.phone}</h3>
                                    </Col>
                                </Row>
                                {currentUser.uid === userId ? <EditButton currentUserId={currentUser.uid}/> : <></>}
                            </Container>
                        </Col>
                        {isScreenSmall &&
                            <Col className="my-5" xs={12}>
                                <div className="mx-5" style={{height: "2px", backgroundColor: "#2f7157"}}></div>
                            </Col>
                        }
                        {isScreenSmall ?
                            <>
                            <PlayerStatistics player={user} stats={stats}/>
                            <Col className="my-5" xs={12}>
                                <div className="mx-5" style={{height: "2px", backgroundColor: "#2f7157"}}></div>
                            </Col>
                            <PlayerLastMatches player={user} stats={stats}/>
                            </>
                            :
                            <Col className="p-0 d-flex flex-column" sm={8}>
                                <PlayerStatistics player={user} stats={stats}/>
                                <Col className="my-5" xs={12}>
                                    <div className="mx-5" style={{height: "2px", backgroundColor: "#2f7157"}}></div>
                                </Col>
                                <PlayerLastMatches player={user} stats={stats}/>
                            </Col>
                        }
                    </Row>
                </Container>
            </Container></>
        );
    }
    else {
        return (
            <></>
        )
    }
}

export default PlayerAccount;