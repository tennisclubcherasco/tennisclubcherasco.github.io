import {useEffect, useRef, useState } from "react";
import {Link, NavLink, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail, signInWithEmailAndPassword,} from "firebase/auth";
import { auth, storage } from "../firebaseConfig";
import {Alert, Button, Container, Form } from "react-bootstrap";
import {getDownloadURL, ref } from "firebase/storage";
import './login.css'

const Login = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState(false);
    const [validated, setValidated] = useState(false);
    const [hover, setHover] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [logoUrl, setLogoUrl] = useState('')
    const [backUrl, setBackUrl] = useState('')

    useEffect(() => {
        const logoRef = ref(storage, 'gs://tennisclubcherasco.appspot.com/utils/logoTennis.png');
        const backRef = ref(storage, 'gs://tennisclubcherasco.appspot.com/utils/campi.jpg')

        getDownloadURL(backRef)
            .then((url) => {
                setBackUrl(url); // Imposta l'URL dell'immagine nello stato
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
                // Signed in
                const user = userCredential.user;
                navigate("/main")
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
    }

    const credentialsWrong = () => {
        setAlert(true);
        setValidated(true);
        setPassword('');
    }

    return(
        <Container fluid className="p-0 d-flex align-items-center" style={{height: '100vh'}}>
            <div className="background-image" style={{backgroundImage: `url(${backUrl})`}}></div>
            {alert ? <Alert variant="danger" style={{width:"50vh"}} onClick={() => setAlert(false)}>
                Invalid username or password!
            </Alert> : <></>}
            <Container fluid className="p-4 login-box">
                <Container className="mt-2 d-flex justify-content-center">
                    <img src={logoUrl} style={{ width: 200, height: 200 }} className="img-fluid d-flex mt-3"/>
                </Container>
                <Container style={{height: 'inherit'}}>
                    <Form noValidate className="mt-4" validated={validated} onSubmit={onLogin}>
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

                        <div className="d-flex justify-content-center" >
                            <Button className="mt-4" variant="primary" type="submit" style={{background: hover ? "#109661FF" : '#2f7157'}}
                                    onMouseEnter={() => setHover(true)}
                                    onMouseOut={() => setHover(false)}
                                    onTouchStart={() => setHover(true)}
                                    onTouchEnd={() => setHover(false)}>
                                Log in
                            </Button>
                        </div>
                    </Form>
                </Container>
            </Container>
        </Container>

        // <>
        //     <main >
        //         <section>
        //             <div>
        //                 <p> FocusApp </p>
        //
        //                 <form>
        //                     <div>
        //                         <label htmlFor="email-address">
        //                             Email address
        //                         </label>
        //                         <input
        //                             id="email-address"
        //                             name="email"
        //                             type="email"
        //                             required
        //                             placeholder="Email address"
        //                             onChange={(e)=>setEmail(e.target.value)}
        //                         />
        //                     </div>
        //
        //                     <div>
        //                         <label htmlFor="password">
        //                             Password
        //                         </label>
        //                         <input
        //                             id="password"
        //                             name="password"
        //                             type="password"
        //                             required
        //                             placeholder="Password"
        //                             onChange={(e)=>setPassword(e.target.value)}
        //                         />
        //                     </div>
        //
        //                     <div>
        //                         <button
        //                             onClick={onLogin}
        //                         >
        //                             Login
        //                         </button>
        //                     </div>
        //                 </form>
        //
        //                 <p className="text-sm text-white text-center">
        //                     No account yet? {' '}
        //                     <NavLink to="/signup">
        //                         Sign up
        //                     </NavLink>
        //                 </p>
        //
        //             </div>
        //         </section>
        //     </main>
        // </>
    )
}

export default Login