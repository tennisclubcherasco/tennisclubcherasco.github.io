import React from 'react';
import { ListGroup } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';
import { FaRankingStar } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { MdOutlineScoreboard } from "react-icons/md";
import './navbar.css'
import { useAuth } from '../AuthContext';

interface MenuProps {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    smallScreen: boolean;
    currentUserId: string;
}

const MenuOffCanvas: React.FC<MenuProps> = ({ show, setShow, smallScreen, currentUserId }) => {
    const navigate = useNavigate();
    const { logout, currentUser } = useAuth();

    const handleLogout = async () => {
        try {
            navigate("/");
            await logout();
        } catch (error) {
            console.error("Errore nel logout:", error);
        }
    };

    return (
        <Offcanvas show={show} onHide={() => setShow(false)} style={{backgroundColor:"#2f7157", color:"white", width:smallScreen ? "65%" : "28%"}} placement={smallScreen ? "start" : "end"}>
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
                            navigate(`/account/${currentUserId}`);
                        }}>
                            <FaUserCircle style={{width:"40px", height:"auto"}}/>
                            <h5 className="ms-3 mb-0">
                                Il mio profilo
                            </h5>
                        </ListGroup.Item>
                        <ListGroup.Item className="menu-item my-font" onClick={() => {
                            setShow(false);
                            navigate("/main");
                        }}>
                            <FaRankingStar style={{width:"40px", height:"auto"}}/>
                            <h5 className="ms-3 mb-0">
                                Ranking
                            </h5>
                        </ListGroup.Item>
                        <ListGroup.Item className="menu-item my-font" onClick={() => {
                            setShow(false);
                            navigate("/newMatch");
                        }}>
                            <MdOutlineScoreboard style={{width:"40px", height:"auto"}}/>
                            <h5 className="ms-3 mb-0">
                                Inserisci risultato
                            </h5>
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