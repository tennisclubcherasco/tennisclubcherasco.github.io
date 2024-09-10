import {getDownloadURL, ref } from "firebase/storage";
import {useEffect, useState } from "react";
import {Col, Container, Navbar, NavbarBrand } from "react-bootstrap";
import { storage } from "./firebaseConfig";

function Main() {
    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        const storageRef = ref(storage, 'gs://tennisclubcherasco.appspot.com/Immagine WhatsApp 2024-07-30 ore 15.31.40_f1acfaf4.jpg');

        // Ottieni l'URL scaricabile
        getDownloadURL(storageRef)
            .then((url) => {
                setImageUrl(url); // Imposta l'URL dell'immagine nello stato
            })
            .catch((error) => {
                console.error('Errore durante il recupero dell\'immagine:', error);
            });
    }, []);
    
    return(
        <Container fluid style={{height: "100vh", width: "100%"}} className="d-flex justify-content-center text-center m-0 p-0">
            <Navbar style={{height: "10vh", width: "100%", backgroundColor: "#2f7157"}}>
                <NavbarBrand className="">Tennis Club Cherasco</NavbarBrand>
            </Navbar>
        </Container>
    )
}

export default Main