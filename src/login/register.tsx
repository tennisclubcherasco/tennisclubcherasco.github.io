import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import {Alert, Button, Col, Container, Form, Row } from "react-bootstrap"
import { storage, auth, db } from "../firebaseConfig";
import { FaTrophy, FaUsers, FaComments } from 'react-icons/fa'
import '../App.css'
import { createUserWithEmailAndPassword } from "firebase/auth";
import {doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

const Register = () => {
    const navigate = useNavigate();

    const [isScreenSmall, setIsScreenSmall] = useState(window.matchMedia('(max-width: 1000px)').matches);
    const [logoInvUrl, setLogoInvUrl] = useState('')
    const [logoUrl, setLogoUrl] = useState('')
    const [validated, setValidated] = useState(false);
    const [submitHover, setSubmitHover] = useState(false);
    const [backHover, setBackHover] = useState(false);

    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')

    const [error, setError] = useState('')
    const [formErrors, setFormErrors] = useState({
        name: "",
        surname: "",
        email: "",
        phone: "",
        password: ""
    });

    useEffect(() => {
        const mediaQueryList = window.matchMedia('(max-width: 900px)');

        const handleResize = (event: { matches: boolean | ((prevState: boolean) => boolean); }) => {
            setIsScreenSmall(event.matches);
        };

        mediaQueryList.addEventListener('change', handleResize);

        return () => {
            mediaQueryList.removeEventListener('change', handleResize);
        };
    }, []);

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
            email: "",
            phone: "",
            password: ""
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

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                status: "PENDING",
                name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
                surname: surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase(),
                email: email,
                phone: phone
            });

            console.log("User registered successfully");
            navigate('/main')

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
                            Consulta le statistiche e lo storico delle tue partite di quelle degli altri giocatori.
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

    return(
        <Container fluid className="p-0 d-flex" style={{height: '100vh'}}>
            <Row className="flex-grow-1 p-0 m-0" style={{height:"100%"}}>
                <LeftSide/>
                <Col className="p-0 d-flex flex-column" sm={isScreenSmall ? 12 : 6}>
                    <Container fluid className="d-flex p-0 m-0 flex-grow-1 align-items-center">
                        <Form noValidate className="" style={{ width: '100%' }} validated={validated} onSubmit={handleRegister}>
                            <Col className="d-flex align-items-center mx-5 mb-4">
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
                            <Row className="justify-content-between mx-5">
                                <Col className="mt-3" sm={6}>
                                    <Form.Group>
                                        <Form.Label>Nome</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            isInvalid={!!formErrors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col className="mt-3" sm={6}>
                                    <Form.Group>
                                        <Form.Label>Cognome</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={surname}
                                            onChange={(e) => setSurname(e.target.value)}
                                            isInvalid={!!formErrors.surname}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.surname}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="justify-content-between mx-5 mt-3">
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        isInvalid={!!formErrors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="justify-content-between mx-5 mt-3">
                                <Form.Group>
                                    <Form.Label>Numero di telefono</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        isInvalid={!!formErrors.phone}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.phone}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="justify-content-between mx-5 mt-3">
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
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
                                        onChange={(e) => setPasswordRepeat(e.target.value)}
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mx-5 mt-3 mb-4">
                                <Container fluid className="d-flex justify-content-center">
                                    <Button className="mt-4" variant="primary" type="submit"
                                            style={{
                                                background: submitHover ? "#109661FF" : '#2f7157',
                                                width: '50%',
                                                borderColor: 'white',
                                                borderRadius: '20px'
                                            }}
                                            onMouseEnter={() => setSubmitHover(true)}
                                            onMouseOut={() => setSubmitHover(false)}
                                            onTouchStart={() => setSubmitHover(true)}
                                            onTouchEnd={() => setSubmitHover(false)}>
                                        Sign Up
                                    </Button>
                                </Container>
                            </Row>
                            <Row className="mx-5 mt-3 mb-4">
                                <Container fluid className="d-flex justify-content-center">
                                    <Button className="" variant="primary" type="button" onClick={() => navigate('/')}
                                            style={{
                                                color: backHover ? 'white' : '#2f7157',
                                                background: backHover ? "#109661FF" : 'white',
                                                width: '50%',
                                                borderColor: backHover ? "white" : '#2f7157',
                                                borderRadius: '18px'
                                            }}
                                            onMouseEnter={() => setBackHover(true)}
                                            onMouseOut={() => setBackHover(false)}
                                            onTouchStart={() => setBackHover(true)}
                                            onTouchEnd={() => setBackHover(false)}>
                                        Indietro
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