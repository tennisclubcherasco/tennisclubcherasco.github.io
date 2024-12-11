import {getDownloadURL, ref } from "firebase/storage";
import {JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState} from "react";
import {Col, Container, Navbar, NavbarBrand, Row} from "react-bootstrap";
import {storage, auth} from "../firebaseConfig";
import MyNavbar from "../navbar/navbar";
import Ranking from "../main/ranking";
import LastMatches from "../main/last_matches";
import './main.css'
import '../App.css'
import * as React from 'react';

function Main() {
    const [imageUrl, setImageUrl] = useState('')
    const [user, setUser] = useState(auth.currentUser);
    const [isScreenSmall, setIsScreenSmall] = useState(window.matchMedia('(max-width: 1000px)').matches);
    const [noLastMatches, setNoLastMatches] = useState(window.matchMedia('(max-width: 1000px)').matches);

    useEffect(() => {
        const mediaQueryList = window.matchMedia('(max-width: 780px)');
        const mediaQueryList2 = window.matchMedia('(max-width: 1100px)');

        const handleResize = (event: { matches: boolean | ((prevState: boolean) => boolean); }) => {
            setIsScreenSmall(event.matches);
        };

        const handleResize2 = (event: { matches: boolean | ((prevState: boolean) => boolean); }) => {
            setNoLastMatches(event.matches);
        };

        mediaQueryList.addEventListener('change', handleResize);
        mediaQueryList2.addEventListener('change', handleResize2);

        return () => {
            mediaQueryList.removeEventListener('change', handleResize);
            mediaQueryList2.removeEventListener('change', handleResize2);
        };
    }, []);

    return(
        <Container fluid style={{height: "", width: "100%"}} className="d-flex flex-column justify-content-center text-center m-0 p-0">
            <MyNavbar/>
            <Container fluid className="p-0 d-flex" style={{height: '100vh'}}>
                <Row className="flex-grow-1 p-0 m-0" style={{height:"100%"}}>
                    <Col className="py-0 my-5 d-flex flex-column" sm={noLastMatches ? 12 : 9} style={{borderRight: noLastMatches ? "" : "2px solid #EFEEEE"}}>
                        <h2 className="my-font mb-3">Players Ranking</h2>
                        <Ranking isScreenSmall={isScreenSmall}/>
                    </Col>
                    {!noLastMatches && <Col className="p-0 d-flex flex-column" sm={3}>
                        <h2 className="my-font my-5">Ultime Partite</h2>
                        <LastMatches/>
                    </Col>}
                </Row>
            </Container>
        </Container>
    )
}

export { Main }