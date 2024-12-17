import {getDownloadURL, ref } from "firebase/storage";
import {useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import { Navbar, NavbarBrand } from "react-bootstrap";
import {auth, storage } from "../firebaseConfig";
import { FaUserCircle } from "react-icons/fa";
import { GrMenu } from "react-icons/gr";
import { useAuth } from "../AuthContext";
import MenuOffCanvas from "./menu_offcanvas";

function MyNavbar() {
    const navigate = useNavigate();
    const [logoInvUrl, setLogoInvUrl] = useState('')
    const [isScreenSmall, setIsScreenSmall] = useState(window.matchMedia('(max-width: 1000px)').matches);
    const {currentUser, loading} = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const logoInvRef = ref(storage, 'gs://tennisclubcherasco.appspot.com/utils/logoTennisInverted.png');

        getDownloadURL(logoInvRef)
            .then((url) => {
                setLogoInvUrl(url);
            })
            .catch((error) => {
                console.error('Errore durante il recupero dell\'immagine:', error);
            });
    }, []);

    useEffect(() => {
        const mediaQueryList = window.matchMedia('(max-width: 850px)');

        const handleResize = (event: { matches: boolean | ((prevState: boolean) => boolean); }) => {
            setIsScreenSmall(event.matches);
        };

        mediaQueryList.addEventListener('change', handleResize);

        return () => {
            mediaQueryList.removeEventListener('change', handleResize);
        };
    }, []);

    return (
        <><MenuOffCanvas show={showMenu} setShow={setShowMenu} smallScreen={isScreenSmall} currentUserId={currentUser ? currentUser.uid : ""}/>
        {
            isScreenSmall ?
                <Navbar style={{height: "90px", width: "100%", backgroundColor: "#2f7157"}}
                        className="d-flex justify-content-between">
                    <div className="d-flex ms-3">
                        <GrMenu className="" style={{width: '30px', height: 'auto', color: 'white', cursor: 'pointer'}}
                                    onClick={() => setShowMenu(true)}/>
                    </div>
                    <img
                        src={logoInvUrl}
                        className="img-fluid"
                        style={{width: '75px', height: 'auto'}}
                        alt="Logo"
                        onClick={() => navigate("/main")}
                    />
                    <div className="me-3 d-flex align-items-center">
                        <FaUserCircle style={{width: '30px', height: 'auto', color: 'white', cursor: 'pointer'}}
                                      onClick={() => navigate(`/account/${currentUser.uid}`)}/>
                    </div>
                </Navbar>
                :
                <Navbar style={{height: "90px", width: "100%", backgroundColor: "#2f7157"}}
                        className="d-flex justify-content-between">
                    <NavbarBrand className="align-items-center d-flex p-0 ms-5">
                        <img
                            src={logoInvUrl}
                            className="img-fluid ms-1"
                            style={{width: '75px', height: 'auto', cursor: 'pointer'}}
                            alt="Logo"
                            onClick={() => navigate("/main")}
                        />
                        <h1 className="my-font ms-3 mb-0" style={{fontSize: "clamp(25px, 5vw, 50px)", color: "white"}}>
                            Tennis Club Cherasco
                        </h1>
                    </NavbarBrand>
                    <div className="me-4 d-flex align-items-center">
                        <FaUserCircle style={{width: '45px', height: 'auto', color: 'white', cursor: 'pointer'}}
                                    onClick={() => navigate(`/account/${currentUser.uid}`)}/>
                        <GrMenu className="ms-5" style={{width: '45px', height: 'auto', color: 'white', cursor: 'pointer'}}
                                    onClick={() => setShowMenu(true)}/>
                    </div>
                </Navbar>
        }</>
    )
}

export default MyNavbar;