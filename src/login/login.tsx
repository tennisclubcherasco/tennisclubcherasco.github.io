import {useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import { sendPasswordResetEmail, signInWithEmailAndPassword,} from "firebase/auth";
import { auth, storage } from "../firebaseConfig";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { getDownloadURL, ref } from "firebase/storage";
import './login.css'
import { FaComments, FaTrophy, FaUsers } from "react-icons/fa";
import ScreenResize from "../utils/screen_resize";

const Login = () => {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [alert, setAlert] = useState(false);
    const [resetAlert, setResetAlert] = useState('');
    const [loginHover, setLoginHover] = useState(false);
    const [registerHover, setRegisterHover] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [logoUrl, setLogoUrl] = useState('')
    const [logoInvUrl, setLogoInvUrl] = useState('')
    const isScreenSmall = ScreenResize(900);

    useEffect(() => {
        const logoRef = ref(storage, 'gs://tennisclubcherasco.appspot.com/utils/logoTennis.png');
        const logoInvRef = ref(storage, 'gs://tennisclubcherasco.appspot.com/utils/logoTennisInverted.png');

        getDownloadURL(logoInvRef)
            .then((url) => {
                setLogoInvUrl(url); // Imposta l'URL dell'immagine nello stato
            })
            .catch((error) => {
                console.error('Errore durante il recupero dell\'immagine:', error);
            });

        getDownloadURL(logoRef)
            .then((url) => {
                setLogoUrl(url); // Imposta l'URL dell'immagine nello stato
            })
            .catch((error) => {
                console.error('Errore durante il recupero dell\'immagine:', error);
            });
    }, []);

    const onLogin = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                navigate("/main")
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
                setAlert(true);
                setEmail('');
                setPassword('');
            });
    }

    const handlePasswordReset = () => {
        if (!email) {
            setResetAlert("Inserisci la tua email per il reset della password");
            return;
        }
        sendPasswordResetEmail(auth, email)
            .then(() => setResetAlert("Email per il reset della password inviata. Controlla la tua casella di posta."))
            .catch((error) => setResetAlert("Errore durante il reset della password. Riprovare più tardi."));
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
                    <Row fluid className="d-flex p-0 m-0 flex-grow-1 align-items-center">
                        <Row className="align-items-center justify-content-center d-flex p-0 m-0">
                            <svg height="40" width="100%">
                                <line x1="0" y1="100%" x2="100%" y2="100%" style={{ stroke: "#2f7157", strokeWidth: 16 }} />
                            </svg>
                            <svg height="100" width="10">
                                <line x1="50%" y1="0%" x2="50%" y2="100%" style={{ stroke: "#2f7157", strokeWidth: 10 }} />
                            </svg>
                        </Row>
                        <Form noValidate className="" validated={validated} style={{width:"100%"}} onSubmit={onLogin}>
                            <Col className="d-flex justify-content-center mx-5 mb-4">
                                {isScreenSmall ?
                                    <img src={logoUrl} className="img-fluid mt-3" style={{maxWidth: '150px', height: 'auto', objectFit: 'scale-down'}} />
                                    :
                                    <></>
                                }
                                <h1 className={isScreenSmall ? "mt-5 my-font" : "mt-2 my-font"} style={{color: '#2f7157'}}>
                                    Accedi con il tuo account
                                </h1>
                            </Col>

                            <Row className="justify-content-center mx-5 mt-3">
                                <Col sm={8}>
                                    {alert && <Alert className="mt-2 mb-5" variant='danger' onClose={() => setAlert(false)} dismissible>Credenziali errate, riprova.</Alert>}
                                    {resetAlert && <Alert variant='info' onClose={() => setResetAlert('')} dismissible>{resetAlert}</Alert>}
                                    <Form.Group id="formBasicEmail">
                                        <Form.Label>Email o Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Inserisci email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="justify-content-center mx-5 mt-3">
                                <Col sm={8}>
                                    <Form.Group className="mt-4" id="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="justify-content-center mx-5 mt-3 mb-4">
                                <Col sm={8} className="d-flex justify-content-center">
                                    <Button className="mt-4" variant="primary" type="submit"
                                            style={{
                                                background: loginHover ? "#109661FF" : '#2f7157',
                                                width: '50%',
                                                borderColor: 'white',
                                                borderRadius: '18px'
                                            }}
                                            onMouseEnter={() => setLoginHover(true)}
                                            onMouseOut={() => setLoginHover(false)}
                                            onTouchStart={() => setLoginHover(true)}
                                            onTouchEnd={() => setLoginHover(false)}>
                                        Log In
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="justify-content-center mx-5 mt-3 mb-4">
                                <Col sm={8} className="d-flex justify-content-center">
                                    <Button className="" variant="primary"
                                            style={{
                                                color: registerHover ? 'white' : '#2f7157',
                                                background: registerHover ? "#109661FF" : 'white',
                                                width: '50%',
                                                borderColor: registerHover ? "white" : '#2f7157',
                                                borderRadius: '18px'
                                            }}
                                            onMouseEnter={() => setRegisterHover(true)}
                                            onMouseOut={() => setRegisterHover(false)}
                                            onTouchStart={() => setRegisterHover(true)}
                                            onTouchEnd={() => setRegisterHover(false)}
                                            onClick={() => navigate("/register")}>
                                        Registrati
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="justify-content-center mx-5 mt-5">
                                <Col sm={4} className="d-flex justify-content-center">
                                    <p
                                        style={{
                                            color: '#007bff',
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                        }}
                                        onClick={handlePasswordReset}
                                    >
                                        Password dimenticata?
                                    </p>
                                </Col>
                            </Row>
                        </Form>
                        <Row className="align-items-center justify-content-center d-flex p-0 m-0">
                            <svg height="100" width="10">
                                <line x1="50%" y1="0%" x2="50%" y2="100%" style={{ stroke: "#2f7157", strokeWidth: 10 }} />
                            </svg>
                            <svg height="40" width="100%">
                                <line x1="0" y1="0%" x2="100%" y2="0%" style={{ stroke: "#2f7157", strokeWidth: 16 }} />
                            </svg>
                        </Row>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default Login