import { useEffect, useRef, useState } from "react";
import { useAuth } from "../AuthContext";
import {downloadImageFromStorage, getUser } from "../utils/get_data";
import {Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import MyNavbar from "../navbar/navbar";
import { FaUserCircle } from "react-icons/fa";
import ScreenResize from "../utils/screen_resize";
import AccountIcon from "../utils/account_icon";

function EditAccount() {
    const isScreenSmall = ScreenResize(900)
    const {currentUser, loading} = useAuth();
    const [user, setUser] = useState<any>(null);
    const [imgButtonHover, setImgButtonHover] = useState(false);
    const [rmvButtonHover, setRmvButtonHover] = useState(false);
    const [validated, setValidated] = useState(false);
    const [submitHover, setSubmitHover] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [profileImageURL, setProfileImageURL] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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
        const fetchProfileImage = async (profileImagePath: string) => {
            if (profileImagePath) {
                try {
                    const downloadURL = await downloadImageFromStorage(profileImagePath);
                    setProfileImageURL(downloadURL);
                } catch (error) {
                    console.error("Error fetching profile image:", error);
                }
            }
        };

        const fetchUser = async () => {
            if (currentUser.uid) {
                try {
                    const userData = await getUser(currentUser.uid);
                    setUser(userData);

                    setName(userData?.name || '');
                    setSurname(userData?.surname || '');
                    setBirthDate(userData?.birthDate || '');
                    setEmail(userData?.email || '');
                    setPhone(userData?.phone || '');
                    setForehand(userData?.forehand || '');
                    setBestShot(userData?.bestShot || '');

                    if (userData?.profileImage) {
                        fetchProfileImage(userData.profileImage);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUser();
    }, [currentUser.uid]);

    const handleEdit = async (e: any) => {

    }

    const handleSelectImage = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const selectedFile = event.target.files[0];
            setImage(selectedFile);

            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const HandleImage = () => {
        if (imagePreview) return (
            <Container className="p-0"
                       style={{
                           width: "150px",
                           height: "150px",
                           borderRadius: "50%",
                           overflow: "hidden",
                       }}
            >
                <img
                    src={imagePreview}
                    alt="Anteprima immagine"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </Container>
        )
        else if (profileImageURL == "") return (
            <AccountIcon size={150}/>
        )
        else if (profileImageURL) return (
            <Container className="p-0"
                       style={{
                           width: "150px",
                           height: "150px",
                           borderRadius: "50%",
                           overflow: "hidden",
                       }}
            >
                <img
                    src={profileImageURL}
                    alt="Anteprima immagine"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </Container>
        )
        else return (
                <AccountIcon size={150}/>
            )
    }

    return (
        <Container fluid style={{height: "", width: "100%"}} className="d-flex flex-column justify-content-center text-center m-0 p-0">
            <MyNavbar/>
            <Container fluid className="justify-content-center mt-4 p-0" style={{width: isScreenSmall ? "100%" : "80%"}}>
                <HandleImage/>
                <Row className="justify-content-center">
                    <Col style={{width:"50%"}}>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <Button className="mt-4" variant="primary" type="submit"
                                style={{
                                    background: imgButtonHover ? "#109661FF" : '#2f7157',
                                    width: isScreenSmall ? '50%' : '25%',
                                    borderColor: 'white',
                                    borderRadius: '18px'
                                }}
                                onMouseEnter={() => setImgButtonHover(true)}
                                onMouseOut={() => setImgButtonHover(false)}
                                onTouchStart={() => setImgButtonHover(true)}
                                onTouchEnd={() => setImgButtonHover(false)}
                                onClick={() => handleSelectImage()}>
                            Cambia immagine profilo
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button className="mt-4" variant="primary" type="submit"
                                style={{
                                    color: rmvButtonHover ? 'white' : '#2f7157',
                                    background: rmvButtonHover ? "#109661FF" : 'white',
                                    width: isScreenSmall ? '50%' : '25%',
                                    borderColor: rmvButtonHover ? "white" : '#2f7157',
                                    borderRadius: '18px',
                                    borderWidth: '3px'
                                }}
                                onMouseEnter={() => setRmvButtonHover(true)}
                                onMouseOut={() => setRmvButtonHover(false)}
                                onTouchStart={() => setRmvButtonHover(true)}
                                onTouchEnd={() => setRmvButtonHover(false)}
                                onClick={() => {
                                    setImage(null);
                                    setImagePreview(null);
                                    setProfileImageURL("");
                                }}>
                            Rimuovi immagine profilo
                        </Button>
                    </Col>
                </Row>
                <Form noValidate className="mt-5" style={{ width: '100%' }} validated={validated} onSubmit={handleEdit}>
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
                        {/*<Container className="d-flex justify-content-center">*/}
                        {/*    <HandleImage/>*/}
                        {/*</Container>*/}
                        {/*<Container className="d-flex justify-content-center">*/}
                        {/*    <input*/}
                        {/*        type="file"*/}
                        {/*        accept="image/*"*/}
                        {/*        ref={fileInputRef}*/}
                        {/*        style={{ display: "none" }}*/}
                        {/*        onChange={handleFileChange}*/}
                        {/*    />*/}
                        {/*    <Button className="mt-4" variant="primary"*/}
                        {/*            style={{*/}
                        {/*                background: imgButtonHover ? "#109661FF" : '#2f7157',*/}
                        {/*                width: isScreenSmall ? '50%' : '40%',*/}
                        {/*                borderColor: 'white',*/}
                        {/*                borderRadius: '18px'*/}
                        {/*            }}*/}
                        {/*            onMouseEnter={() => setImgButtonHover(true)}*/}
                        {/*            onMouseOut={() => setImgButtonHover(false)}*/}
                        {/*            onTouchStart={() => setImgButtonHover(true)}*/}
                        {/*            onTouchEnd={() => setImgButtonHover(false)}*/}
                        {/*            onClick={() => handleSelectImage()}>*/}
                        {/*        Cambia immagine profilo*/}
                        {/*    </Button>*/}
                        {/*</Container>*/}
                    </Row>
                    <Row className="justify-content-between mx-5">
                        <Col className="mt-3" sm={4}>
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
                        <Col className="mt-3" sm={4}>
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
                        <Col className="mt-3" sm={4}>
                            <Form.Group>
                                <Form.Label>Data di nascita</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={birthDate}
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
                                    onChange={(e) => setPhone(e.target.value)}
                                    isInvalid={!!formErrors.phone}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.phone}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="justify-content-between mx-5">
                        <Col className="mt-3" sm={6}>
                            <Form.Group>
                                <Form.Label>Lato diritto</Form.Label>
                                <Form.Select
                                    value={forehand}
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
                    <Row className="mx-5 mt-4 mb-4">
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
                                Modifica profilo
                            </Button>
                        </Container>
                    </Row>
                    {/*<Row className="mx-5 mt-3 mb-4">*/}
                    {/*    <Container fluid className="d-flex justify-content-center">*/}
                    {/*        <Button className="" variant="primary" type="button" onClick={() => navigate('/')}*/}
                    {/*                style={{*/}
                    {/*                    color: backHover ? 'white' : '#2f7157',*/}
                    {/*                    background: backHover ? "#109661FF" : 'white',*/}
                    {/*                    width: '50%',*/}
                    {/*                    borderColor: backHover ? "white" : '#2f7157',*/}
                    {/*                    borderRadius: '18px'*/}
                    {/*                }}*/}
                    {/*                onMouseEnter={() => setBackHover(true)}*/}
                    {/*                onMouseOut={() => setBackHover(false)}*/}
                    {/*                onTouchStart={() => setBackHover(true)}*/}
                    {/*                onTouchEnd={() => setBackHover(false)}>*/}
                    {/*            Indietro*/}
                    {/*        </Button>*/}
                    {/*    </Container>*/}
                    {/*</Row>*/}
                </Form>
            </Container>
        </Container>
    );
}

export default EditAccount;