import {Button, Col, Container, Row } from "react-bootstrap";
import MyNavbar from "../navbar/navbar";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import {getUser} from "../utils/get_data";
import { useAuth } from "../AuthContext";

function PlayerAccount() {
    const navigate = useNavigate();
    const { userId } = useParams<{userId: string}>();
    const {currentUser, loading} = useAuth();
    const [isScreenSmall, setIsScreenSmall] = useState(window.matchMedia('(max-width: 1000px)').matches);
    const [user, setUser] = useState<any>(null);
    const [accountHover, setAccountHover] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            if (userId) {
                const userData = await getUser(userId);
                setUser(userData);
            }
        };
        fetchUser();
    }, [userId]);

    useEffect(() => {
        const mediaQueryList1 = window.matchMedia('(max-width: 1200px)');

        const handleResize1 = (event: { matches: boolean | ((prevState: boolean) => boolean); }) => {
            setIsScreenSmall(event.matches);
        };

        mediaQueryList1.addEventListener('change', handleResize1);

        return () => {
            mediaQueryList1.removeEventListener('change', handleResize1);
        };
    }, []);

    const EditButton = () => {
        if (currentUser.uid == userId) {
            return(
                <Row>
                    <Col className="p-0 mt-3">
                        <Button className="mt-4" variant="primary" type="submit"
                                style={{
                                    background: accountHover ? "#109661FF" : '#2f7157',
                                    width: '50%',
                                    borderColor: 'white',
                                    borderRadius: '18px'
                                }}
                                onMouseEnter={() => setAccountHover(true)}
                                onMouseOut={() => setAccountHover(false)}
                                onTouchStart={() => setAccountHover(true)}
                                onTouchEnd={() => setAccountHover(false)}
                                onClick={() => navigate(`/account/${currentUser.uid}/edit`)}>
                            Modifica profilo
                        </Button>
                    </Col>
                </Row>
            )
        }
        else {
            return (
                <></>
            )
        }
    }

    if (user != null) {
        return (
            <Container fluid style={{height: "", width: "100%"}} className="d-flex flex-column justify-content-center text-center m-0 p-0">
                <MyNavbar/>
                <Container fluid className="p-0 d-flex" style={{height: '100vh'}}>
                    <Row className="flex-grow-1 p-0 m-0" style={{height:"100%"}}>
                        <Col className="py-0 my-2 d-flex flex-column" sm={isScreenSmall ? 12 : 4} style={{borderRight: isScreenSmall ? "" : "2px solid #EFEEEE"}}>
                            <Container fluid className="justify-content-center mt-4">
                                <FaUserCircle style={{ width:'170px', height:'auto', color: 'black', maxWidth: '30%', objectFit: 'scale-down' }} />
                            </Container>
                            <h1 className="my-font mt-3">{user.name} {user.surname}</h1>
                            <Container className="d-flex flex-column mt-4">
                                <Row className="mt-3">
                                    <Col className="" xs={6}>
                                        <h4 className="my-font">Ranking attuale:</h4>
                                        <h2 className="my-font" style={{color:"#2f7157"}}>12</h2>
                                    </Col>
                                    <Col className="" xs={6}>
                                        <h4 className="my-font">Best Ranking:</h4>
                                        <h2 className="my-font" style={{color:"#2f7157"}}>5</h2>
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
                                <EditButton/>
                            </Container>
                        </Col>
                        {!isScreenSmall && <Col className="p-0 d-flex flex-column" sm={8}>

                        </Col>}
                    </Row>
                </Container>
            </Container>
        );
    }
    else {
        return (
            <></>
        )
    }
}

export default PlayerAccount;