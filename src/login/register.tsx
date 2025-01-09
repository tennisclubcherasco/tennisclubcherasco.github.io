import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import {Alert, Button, Col, Container, Form, Row } from "react-bootstrap"
import { storage, auth, db } from "../firebaseConfig";
import { FaTrophy, FaUsers, FaComments, FaUserCircle } from 'react-icons/fa'
import '../App.css'
import { createUserWithEmailAndPassword } from "firebase/auth";
import {collection, doc, setDoc} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import AccountIcon from "../utils/account_icon";
import ScreenResize from "../utils/screen_resize";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {handleFileChange, uploadImage} from "../utils/image_handler";
import { FormStyle } from "../utils/utility";
import {UpdateRanking} from "../utils/score_ranking";

const Register = () => {
    const navigate = useNavigate();
    const isScreenSmall = ScreenResize(900)
    const [logoInvUrl, setLogoInvUrl] = useState('')
    const [logoUrl, setLogoUrl] = useState('')
    const [validated, setValidated] = useState(false);
    const [imgButtonHover, setImgButtonHover] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({
        unit: "px", // unità di misura
        width: 100, // larghezza iniziale del crop
        height: 100, // altezza iniziale del crop
        x: 0, // posizione orizzontale del crop
        y: 0, // posizione verticale del crop
    });

    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')
    const [forehand, setForehand] = useState('')
    const [bestShot, setBestShot] = useState('')

    const [error, setError] = useState('')
    const [formErrors, setFormErrors] = useState({
        name: "",
        surname: "",
        birthDate: "",
        email: "",
        phone: "",
        password: "",
        forehand: "",
        bestShot: ""
    });

    useEffect(() => {
        const logoInvRef = ref(storage, 'gs://tennisclubcherasco.appspot.com/utils/logoTennisInverted.png');
        const logoRef = ref(storage, 'gs://tennisclubcherasco.appspot.com/utils/logoTennis.png')

        getDownloadURL(logoRef)
            .then((url) => {
                setLogoUrl(url); // Imposta l'URL dell'immagine nello stato
            })
            .catch((error) => {
                console.error('Errore durante il recupero dell\'immagine:', error);
            });

        getDownloadURL(logoInvRef)
            .then((url) => {
                setLogoInvUrl(url); // Imposta l'URL dell'immagine nello stato
            })
            .catch((error) => {
                console.error('Errore durante il recupero dell\'immagine:', error);
            });
    }, []);

    const checkValidity = () : Boolean => {
        let formErrors = {
            name: "",
            surname: "",
            birthDate: "",
            email: "",
            phone: "",
            password: "",
            forehand: "",
            bestShot: ""
        };
        let formValid = true;

        if (!name) {
            formErrors.name = "Il nome è obbligatorio.";
            formValid = false;
        }

        if (!surname) {
            formErrors.surname = "Il cognome è obbligatorio.";
            formValid = false;
        }

        if (!birthDate) {
            formErrors.birthDate = "La data di nascita è obbligatoria.";
            formValid = false;
        }

        if (new Date(birthDate) > new Date()) {
            formErrors.birthDate = "La data di nascita non è valida."
        }

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            formErrors.email = "Inserisci un'email valida.";
            formValid = false;
        }

        if (!phone || !/^\d{10}$/.test(phone)) {
            formErrors.phone = "Inserisci un numero di telefono valido.";
            formValid = false;
        }

        if (!password || password.length < 8) {
            formErrors.password = "La password deve essere lunga almeno 8 caratteri.";
            formValid = false;
        }

        if (!password.match(/[a-z]/) || !password.match(/[A-Z]/) || !password.match(/[0-9]/)) {
            formErrors.password = "La password deve contenere almeno una lettera maiuscola, una lettera minuscola e un numero.";
            formValid = false;
        }

        if (password.match(/\s/)) {
            formErrors.password = "La password non può contenere spazi.";
            formValid = false;
        }

        if (password !== passwordRepeat) {
            formErrors.password = "Le password non corrispondono.";
            formValid = false;
        }

        if (!forehand) {
            formErrors.forehand = "Seleziona il lato del diritto.";
            formValid = false;
        }

        if (!bestShot) {
            formErrors.bestShot = "Seleziona il colpo preferito.";
            formValid = false;
        }

        setFormErrors(formErrors);
        return formValid;
    }

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (checkValidity() === false) {
            return;
        }
        else {
            console.log("Registration form valid")
            setName(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
            setSurname(surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase())
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const profileImage = await uploadImage(image, user.uid);

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                status: "PENDING",
                name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
                surname: surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase(),
                birthDate: birthDate,
                email: email,
                phone: phone,
                forehand: forehand,
                bestShot: bestShot,
                profileImage: profileImage,
                score: 1000,
                bestRanking: null
            });

            const statsRef = doc(collection(doc(db, "users", user.uid), "stats"));
            await setDoc(statsRef, {
                matches: 0,
                win: 0,
                lose: 0
            });

            console.log("User registered successfully");
            await UpdateRanking();
            navigate('/main');
        } catch (err) {
            console.error(err);
            if (err instanceof FirebaseError) {
                if (err.code === "auth/email-already-in-use") {
                    setError("Email già in uso");
                }
            } else {
                setError("Errore sconosciuto");
            }
        }
    };

    const LeftSide = () => {
        return (
            isScreenSmall ?
            <></>
                :
            <Col className="d-flex flex-column p-0" sm={6} style={{backgroundColor: `#2f7157`}}>
                <Row className="justify-content-center">
                    <img src={logoInvUrl} className="img-fluid d-flex mt-3" style={{maxWidth: '30%', height: 'auto', objectFit: 'scale-down'}} />
                </Row>
                <Row className="d-flex justify-content-center" style={{marginTop: '4vw'}}>
                    <Col className="d-flex align-items-center justify-content-end p-0 me-3" sm={3}>
                        <FaTrophy style={{ width: '5vw', height: 'auto', color: 'white' }}/>
                    </Col>
                    <Col className="d-flex flex-column p-0 ms-4" sm={6}>
                        <h2 className="my-font" style={{color: 'white'}}>
                            Ranking ufficiale
                        </h2>
                        <h4 className="my-font" style={{color: 'white', fontWeight: 'lighter'}}>
                            Scala le posizioni del ranking fino alla vetta grazie all'innovativo sistema di assegnazione dei punti.
                        </h4>
                    </Col>
                </Row>
                <Row className="d-flex justify-content-center" style={{marginTop: '4vw'}}>
                    <Col className="d-flex align-items-center justify-content-end p-0 me-3" sm={3}>
                        <FaUsers style={{ width: '5vw', height: 'auto', color: 'white' }}/>
                    </Col>
                    <Col className="d-flex flex-column p-0 ms-4" sm={6}>
                        <h2 className="my-font" style={{color: 'white'}}>
                            Match history
                        </h2>
                        <h4 className="my-font" style={{color: 'white', fontWeight: 'lighter'}}>
                            Consulta le statistiche e lo storico delle tue partite e di quelle degli altri giocatori.
                        </h4>
                    </Col>
                </Row>
                <Row className="d-flex justify-content-center" style={{marginTop: '4vw'}}>
                    <Col className="d-flex align-items-center justify-content-end p-0 me-3" sm={3}>
                        <FaComments style={{ width: '5vw', height: 'auto', color: 'white' }}/>
                    </Col>
                    <Col className="d-flex flex-column p-0 ms-4" sm={6}>
                        <h2 className="my-font" style={{color: 'white'}}>
                            Socializza
                        </h2>
                        <h4 className="my-font" style={{color: 'white', fontWeight: 'lighter'}}>
                            Trova e contatta nuovi avversari.
                        </h4>
                    </Col>
                </Row>
            </Col>
        )
    }

    const HandleImage = () => {
        if (image == null) return (
            <AccountIcon size={120}/>
        )
        else if (imagePreview) return (
            <div
                style={{
                    width: "150px", // Imposta la larghezza del cerchio
                    height: "150px", // Imposta l'altezza del cerchio
                    borderRadius: "50%", // Per farlo circolare
                    overflow: "hidden", // Nascondi le parti fuori dal cerchio
                }}
            >
                {/*<ReactCrop*/}
                {/*    crop={crop}*/}
                {/*    onChange={(newCrop) => null}*/}
                {/*    ruleOfThirds*/}
                {/*>*/}
                    <img
                        src={imagePreview}
                        alt="Anteprima immagine"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                {/*</ReactCrop>*/}
            </div>
        )
        else return (
            <AccountIcon size={120}/>
        )
    }

    return(
        <Container fluid className="p-0 d-flex" style={{height: '100vh'}}>
            <Row className="flex-grow-1 p-0 m-0" style={{height:"100%"}}>
                <LeftSide/>
                <Col className="p-0 d-flex flex-column" sm={isScreenSmall ? 12 : 6}>
                    <Container fluid className="d-flex p-0 m-0 flex-grow-1 align-items-center">
                        <Form noValidate className="" style={{ width: '100%' }} validated={validated} onSubmit={handleRegister}>
                            <Col className="d-flex justify-content-center align-items-center mx-5 mb-4">
                                {isScreenSmall ?
                                    <img src={logoUrl} className="img-fluid mt-3" style={{maxWidth: '150px', height: 'auto', objectFit: 'scale-down'}} />
                                        :
                                    <></>
                                }
                                <h1 className="mt-5 px-2 my-font" style={{color: '#2f7157'}}>
                                    Crea il tuo account ed inizia a competere
                                </h1>
                            </Col>
                            {error ?
                                <Alert className="mx-5" variant='danger' onClose={() => setError('')} dismissible>
                                    <p className="m-0">
                                        {error}
                                    </p>
                                </Alert>
                                :
                                <></>
                            }
                            <Row>
                                <Container className="d-flex justify-content-center">
                                    <HandleImage/>
                                </Container>
                                <Container className="d-flex justify-content-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={(event) => handleFileChange(event, setImage, setImagePreview)}
                                    />
                                    <Button className="mt-4" variant="primary"
                                            style={{
                                                background: imgButtonHover ? "#109661FF" : '#2f7157',
                                                width: isScreenSmall ? '50%' : '40%',
                                                borderColor: 'white',
                                                borderRadius: '18px',
                                                minHeight: '40px',
                                            }}
                                            onMouseEnter={() => setImgButtonHover(true)}
                                            onMouseOut={() => setImgButtonHover(false)}
                                            onTouchStart={() => setImgButtonHover(true)}
                                            onTouchEnd={() => setImgButtonHover(false)}
                                            onClick={() => fileInputRef.current?.click()}>
                                        <h4 className="my-font" style={{ pointerEvents: "none" }}>
                                            Seleziona immagine
                                        </h4>
                                    </Button>
                                </Container>
                            </Row>
                            <Row className="justify-content-between mx-5">
                                <Col className="mt-3" sm={4}>
                                    <Form.Group>
                                        <Form.Label>Nome</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={name}
                                            style={FormStyle}
                                            onChange={(e) => setName(e.target.value)}
                                            isInvalid={!!formErrors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col className="mt-3" sm={4}>
                                    <Form.Group>
                                        <Form.Label>Cognome</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={surname}
                                            style={FormStyle}
                                            onChange={(e) => setSurname(e.target.value)}
                                            isInvalid={!!formErrors.surname}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.surname}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col className="mt-3" sm={4}>
                                    <Form.Group>
                                        <Form.Label>Data di nascita</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={birthDate}
                                            style={FormStyle}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            isInvalid={!!formErrors.birthDate}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.birthDate}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="justify-content-between mx-5">
                                <Col className="mt-3" sm={6}>
                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            style={FormStyle}
                                            onChange={(e) => setEmail(e.target.value)}
                                            isInvalid={!!formErrors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col className="mt-3" sm={6}>
                                    <Form.Group>
                                        <Form.Label>Numero di telefono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={phone}
                                            style={FormStyle}
                                            onChange={(e) => setPhone(e.target.value)}
                                            isInvalid={!!formErrors.phone}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.phone}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="justify-content-between mx-5 mt-3">
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        style={FormStyle}
                                        onChange={(e) => setPassword(e.target.value)}
                                        isInvalid={!!formErrors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.password}
                                    </Form.Control.Feedback>
                                    <Form.Text muted>
                                        La password deve essere lunga minimo 8 caratteri e contenere lettere maiuscole, lettere minuscole e numeri. Non può contenere spazi.
                                    </Form.Text>
                                </Form.Group>
                            </Row>
                            <Row className="justify-content-between mx-5 mt-3">
                                <Form.Group>
                                    <Form.Label>Ripeti password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={passwordRepeat}
                                        style={FormStyle}
                                        onChange={(e) => setPasswordRepeat(e.target.value)}
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="justify-content-between mx-5">
                                <Col className="mt-3" sm={6}>
                                    <Form.Group>
                                        <Form.Label>Lato diritto</Form.Label>
                                        <Form.Select
                                            value={forehand}
                                            style={FormStyle}
                                            onChange={(e) => setForehand(e.target.value)}
                                            isInvalid={!!formErrors.forehand}
                                        >
                                            <option>Seleziona...</option>
                                            <option value="Destra">Destra</option>
                                            <option value="Sinistra">Sinistra</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.forehand}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col className="mt-3" sm={6}>
                                    <Form.Group>
                                        <Form.Label>Colpo preferito</Form.Label>
                                        <Form.Select
                                            value={bestShot}
                                            style={FormStyle}
                                            onChange={(e) => setBestShot(e.target.value)}
                                            isInvalid={!!formErrors.bestShot}
                                        >
                                            <option>Seleziona...</option>
                                            <option value="Diritto">Diritto</option>
                                            <option value="Rovescio">Rovescio</option>
                                            <option value="Servizio">Servizio</option>
                                            <option value="Volée">Volée</option>
                                            <option value="Smash">Smash</option>
                                            <option value="Palla corta">Palla corta</option>
                                            <option value="Slice">Slice</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.bestShot}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mx-5 mt-3 mb-4">
                                <Container fluid className="d-flex justify-content-center">
                                    <Button className="my-button mt-4" variant="primary" type="submit"
                                            style={{
                                                width: '50%',
                                                minHeight: '40px',
                                            }}>
                                        <h5 className="my-font" style={{ pointerEvents: "none" }}>
                                            Registrati
                                        </h5>
                                    </Button>
                                </Container>
                            </Row>
                            <Row className="mx-5 mt-3 mb-4">
                                <Container fluid className="d-flex justify-content-center">
                                    <Button className="my-button-outlined " variant="primary" type="button" onClick={() => navigate(-1)}
                                            style={{
                                                width: '50%',
                                                minHeight: '40px',
                                            }}>
                                        <h5 className="my-font" style={{ pointerEvents: "none" }}>
                                            Indietro
                                        </h5>
                                    </Button>
                                </Container>
                            </Row>
                        </Form>
                    </Container>
                </Col>
            </Row>
        </Container>
    )
}

export default Register