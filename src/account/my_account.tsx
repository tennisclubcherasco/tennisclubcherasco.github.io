import {Col, Container, Row } from "react-bootstrap";
import MyNavbar from "../navbar/navbar";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import {getUser} from "../utils/get_data";

function PlayerAccount() {
    const { userId } = useParams<{userId: string}>();
    const [isScreenSmall, setIsScreenSmall] = useState(window.matchMedia('(max-width: 1000px)').matches);
    const [noMargin, setNoMargin] = useState(window.matchMedia('(max-width: 1500px)').matches);
    const [user, setUser] = useState<any>(null);

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
        const mediaQueryList2 = window.matchMedia('(min-width: 1200px) and (max-width: 1500px)');

        const handleResize1 = (event: { matches: boolean | ((prevState: boolean) => boolean); }) => {
            setIsScreenSmall(event.matches);
        };
        const handleResize2 = (event: { matches: boolean | ((prevState: boolean) => boolean); }) => {
            setNoMargin(event.matches);
        };

        mediaQueryList1.addEventListener('change', handleResize1);
        mediaQueryList2.addEventListener('change', handleResize2);

        return () => {
            mediaQueryList1.removeEventListener('change', handleResize1);
            mediaQueryList2.removeEventListener('change', handleResize2);
        };
    }, []);

    const infoMargin = noMargin ? "d-flex justify-content-between mt-3" : "d-flex justify-content-between mt-3 mx-5"

    if (user != null) {
        return (
            <Container fluid style={{height: "", width: "100%"}} className="d-flex flex-column justify-content-center text-center m-0 p-0">
                <MyNavbar/>
                <Container fluid className="p-0 d-flex" style={{height: '100vh'}}>
                    <Row className="flex-grow-1 p-0 m-0" style={{height:"100%"}}>
                        <Col className="py-0 my-5 d-flex flex-column" sm={isScreenSmall ? 12 : 4} style={{borderRight: isScreenSmall ? "" : "2px solid #EFEEEE"}}>
                            <Container fluid className="justify-content-center mt-4">
                                <FaUserCircle style={{ width:'170px', height:'auto', color: 'black', maxWidth: '30%', objectFit: 'scale-down' }} />
                            </Container>
                            <h1 className="my-font mt-3">{user.name} {user.surname}</h1>
                            <Container className="d-flex flex-column mt-4">
                                <Col className={infoMargin}>
                                    <h5>Ranking attuale:</h5><h4></h4>
                                </Col>
                                <Col className={infoMargin}>
                                    <h5>Best ranking:</h5><h4></h4>
                                </Col>
                                <Col className={infoMargin}>
                                    <h5>Lato diritto:</h5><h5></h5>
                                </Col>
                                <Col className={infoMargin}>
                                    <h5>Colpo preferito:</h5><h5></h5>
                                </Col>
                                <Col className={infoMargin}>
                                    <h5>Email:</h5><h5>{user.email}</h5>
                                </Col>
                                <Col className={infoMargin}>
                                    <h5>Telefono:</h5><h5>{user.phone}</h5>
                                </Col>
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