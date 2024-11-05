import {getDownloadURL, ref } from "firebase/storage";
import {useEffect, useState } from "react";
import {Col, Container, Navbar, NavbarBrand, Row } from "react-bootstrap";
import { storage, auth } from "../firebaseConfig";
import MyNavbar from "../navbar/navbar";
import './main.css'
import '../App.css'

function Main() {
    const [imageUrl, setImageUrl] = useState('')
    const [user, setUser] = useState(auth.currentUser);
    const [isScreenSmall, setIsScreenSmall] = useState(window.matchMedia('(max-width: 1000px)').matches);

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

    return(
        <Container fluid style={{height: "100vh", width: "100%"}} className="d-flex justify-content-center text-center m-0 p-0">
            <MyNavbar/>
        </Container>
    )
}

export { Main }