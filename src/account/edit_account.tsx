import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { getUser } from "../utils/get_data";
import {Button, Col, Container, Row } from "react-bootstrap";
import MyNavbar from "../navbar/navbar";
import { FaUserCircle } from "react-icons/fa";

function EditAccount() {
    const {currentUser, loading} = useAuth();
    const [user, setUser] = useState<any>(null);
    const [imgButtonHover, setImgButtonHover] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUser(currentUser.uid);
            setUser(userData);
        };
        fetchUser();
    }, []);

    return (
        <Container fluid style={{height: "", width: "100%"}} className="d-flex flex-column justify-content-center text-center m-0 p-0">
            <MyNavbar/>
            <Container fluid className="justify-content-center mt-4">
                <FaUserCircle style={{ width:'170px', height:'auto', color: 'black', maxWidth: '30%', objectFit: 'scale-down' }} />
                <Row>
                    <Col>
                        <Button className="mt-4" variant="primary" type="submit"
                                style={{
                                    background: imgButtonHover ? "#109661FF" : '#2f7157',
                                    width: '30%',
                                    borderColor: 'white',
                                    borderRadius: '18px'
                                }}
                                onMouseEnter={() => setImgButtonHover(true)}
                                onMouseOut={() => setImgButtonHover(false)}
                                onTouchStart={() => setImgButtonHover(true)}
                                onTouchEnd={() => setImgButtonHover(false)}
                                onClick={() => null}>
                            Cambia immagine profilo
                        </Button>
                    </Col>
                </Row>

            </Container>
        </Container>
    );
}

export default EditAccount;