import {getDownloadURL, ref } from "firebase/storage";
import {useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import {Container, Navbar, NavbarBrand } from "react-bootstrap";
import {auth, storage } from "../firebaseConfig";
import { GrMenu } from "react-icons/gr";
import { useAuth } from "../AuthContext";
import MenuOffCanvas from "./menu_offcanvas";
import ScreenResize from "../utils/screen_resize";
import {fetchProfileImage, getUser } from "../utils/get_data";
import { ImageHandler } from "../utils/image_handler";

function MyNavbar() {
    const navigate = useNavigate();
    const isScreenSmall = ScreenResize(850);
    const {currentUser, loading} = useAuth();
    const [profileImageURL, setProfileImageURL] = useState<string | null>(null);
    const [logoInvUrl, setLogoInvUrl] = useState('');
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
        const loadProfileImage = async (imageURL: string) => {
            const downloadURL = await fetchProfileImage(imageURL);
            if(downloadURL) setProfileImageURL(downloadURL);
        }

        const fetchUser = async () => {
            if (currentUser.uid) {
                try {
                    const userData = await getUser(currentUser.uid);

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

    return (
        <><MenuOffCanvas show={showMenu} setShow={setShowMenu} smallScreen={isScreenSmall} currentUserId={currentUser.uid}/>
        {
            isScreenSmall ?
                <Navbar style={{ height: "90px", width: "100%", backgroundColor: "#2f7157" }} className="d-flex align-items-center">
                    <div className="d-flex align-items-center ms-1" style={{ flex: 1, justifyContent: "start", paddingLeft: "10px" }}>
                        <GrMenu
                            style={{ width: "30px", height: "auto", color: "white", cursor: "pointer" }}
                            onClick={() => setShowMenu(true)}
                        />
                    </div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <img
                            src={logoInvUrl}
                            className="img-fluid"
                            style={{ width: "75px", height: "auto", cursor: "pointer" }}
                            alt="Logo"
                            onClick={() => navigate("/main")}
                        />
                    </div>
                    <div className="d-flex align-items-center justify-content-end me-1" style={{ flex: 1, paddingRight: "10px" }}>
                        <ImageHandler
                            size={52}
                            imageUrl={profileImageURL}
                            onClick={() => navigate(`/account/${currentUser.uid}`)}
                            backColor={"white"}
                        />
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
                        <ImageHandler size={55} imageUrl={profileImageURL} onClick={() => navigate(`/account/${currentUser.uid}`)} backColor={"white"}/>
                        <GrMenu className="ms-4" style={{width: '45px', height: 'auto', color: 'white', cursor: 'pointer'}}
                                    onClick={() => setShowMenu(true)}/>
                    </div>
                </Navbar>
        }</>
    )
}

export default MyNavbar;