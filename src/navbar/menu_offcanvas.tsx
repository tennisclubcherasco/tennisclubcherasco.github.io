import React from 'react';
import { ListGroup } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';
import { FaRankingStar } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import './navbar.css'
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

interface MenuProps {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    smallScreen: boolean;
    currentUserId: string;
}

const MenuOffCanvas: React.FC<MenuProps> = ({ show, setShow, smallScreen, currentUserId }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Errore nel logout:", error);
        } finally {
            setShow(false);
        }
    };

    return (
        <Offcanvas show={show} onHide={() => setShow(false)} style={{backgroundColor:"#2f7157", color:"white", width:smallScreen ? "50%" : "25%"}} placement={smallScreen ? "start" : "end"}>
            <Offcanvas.Header closeButton style={{color:"white"}}>
                <Offcanvas.Title>
                    <h2 className="ms-3 my-font">
                        Menù
                    </h2>
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column justify-content-between mb-3">
                    <ListGroup variant="flush">
                        <ListGroup.Item className="menu-item my-font" onClick={() => {
                            setShow(false);
                            navigate("/main");
                        }}>
                            <FaRankingStar style={{width:"40px", height:"auto"}}/>
                            <h4 className="ms-3 mb-0">
                                Ranking
                            </h4>
                        </ListGroup.Item>
                        <ListGroup.Item className="menu-item my-font" onClick={() => {
                            setShow(false);
                            navigate(`/account/${currentUserId}`);
                        }}>
                            <FaUserCircle style={{width:"40px", height:"auto"}}/>
                            <h4 className="ms-3 mb-0">
                                Il mio profilo
                            </h4>
                        </ListGroup.Item>
                    </ListGroup>
                    <ListGroup variant="flush">
                        <ListGroup.Item className="menu-item my-font" onClick={() => { handleLogout() }}>
                            <MdLogout style={{width:"40px", height:"auto"}}/>
                            <h4 className="ms-3 mb-0">
                                Log Out
                            </h4>
                        </ListGroup.Item>
                    </ListGroup>
                </Offcanvas.Body>
        </Offcanvas>
    )
}

export default MenuOffCanvas;