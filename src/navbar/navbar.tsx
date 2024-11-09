import {getDownloadURL, ref } from "firebase/storage";
import {useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import { Navbar, NavbarBrand } from "react-bootstrap";
import { storage } from "../firebaseConfig";
import { FaUserCircle } from "react-icons/fa";
import { GrMenu } from "react-icons/gr";

function MyNavbar() {
    const navigate = useNavigate();
    const [logoInvUrl, setLogoInvUrl] = useState('')
    const [isScreenSmall, setIsScreenSmall] = useState(window.matchMedia('(max-width: 1000px)').matches);

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
        isScreenSmall ?
        <Navbar style={{ height: "90px", width: "100%", backgroundColor: "#2f7157" }} className="d-flex justify-content-between">
            <div className="d-flex ms-3">
                <GrMenu className="" style={{ width:isScreenSmall ? '30px' : '45px', height:'auto', color: 'white' }} />
            </div>
            <img
                src={logoInvUrl}
                className="img-fluid"
                style={{ width:'75px', height: 'auto' }}
                alt="Logo"
            />
            <div className="me-3 d-flex align-items-center">
                <FaUserCircle style={{ width:isScreenSmall ? '30px' : '45px', height:'auto', color: 'white' }} />
            </div>
        </Navbar>
            :
        <Navbar style={{ height: "90px", width: "100%", backgroundColor: "#2f7157" }} className="d-flex justify-content-between">
            <NavbarBrand className="align-items-center d-flex p-0">
                <img
                    src={logoInvUrl}
                    className={isScreenSmall ? "img-fluid ms-1" : "img-fluid ms-4"}
                    style={{ width:'75px', height: 'auto', cursor: 'pointer' }}
                    alt="Logo"
                    onClick={() => navigate("/main")}
                />
                <h1 className={isScreenSmall ? "my-font ms-1 mb-0" : "my-font ms-3 mb-0"} style={{fontSize: "clamp(25px, 5vw, 50px)", color:"white"}}>
                    Tennis Club Cherasco
                </h1>
            </NavbarBrand>
            <div className="me-4 d-flex align-items-center">
                <FaUserCircle style={{ width:isScreenSmall ? '30px' : '45px', height:'auto', color:'white', cursor:'pointer' }} onClick={() => navigate("/account")}/>
                <GrMenu className="ms-5" style={{ width:isScreenSmall ? '30px' : '45px', height:'auto', color: 'white' }} />
            </div>
        </Navbar>
    )
}

export default MyNavbar;