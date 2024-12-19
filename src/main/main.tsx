import {Col, Container, Row} from "react-bootstrap";
import MyNavbar from "../navbar/navbar";
import Ranking from "../main/ranking";
import LastMatches from "../main/last_matches";
import './main.css'
import '../App.css'
import * as React from 'react';
import ScreenResize from "../utils/screen_resize";

function Main() {
    const isScreenSmall = ScreenResize(780);
    const noLastMatches = ScreenResize(1100);

    return(
        <Container fluid style={{width: "100%"}} className="d-flex flex-column justify-content-center text-center m-0 p-0">
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