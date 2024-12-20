import { useEffect, useRef, useState } from "react";
import { useAuth } from "../AuthContext";
import {downloadImageFromStorage, fetchProfileImage, getUser } from "../utils/get_data";
import {Alert, Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import MyNavbar from "../navbar/navbar";
import ScreenResize from "../utils/screen_resize";
import AccountIcon from "../utils/account_icon";
import {useNavigate, useParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { uploadImage } from "../utils/image_handler";
import {deleteObject, ref } from "firebase/storage";
import '../App.css';
import { FormStyle } from "../utils/utility";

function EditAccount() {
    const navigate = useNavigate();
    const isScreenSmall = ScreenResize(900)
    const {currentUser} = useAuth();
    const [user, setUser] = useState<any>(null);

    const [validated, setValidated] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [profileImageURL, setProfileImageURL] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [forehand, setForehand] = useState('')
    const [bestShot, setBestShot] = useState('')
    let updatedData: any = {};

    const [error, setError] = useState('')
    const [formErrors, setFormErrors] = useState({
        name: "",
        surname: "",
        birthDate: "",
        email: "",
        phone: "",
        forehand: "",
        bestShot: ""
    });

    useEffect(() => {
        const loadProfileImage = async (imageURL: string) => {
            const downloadURL = await fetchProfileImage(imageURL);
            if(downloadURL) setProfileImageURL(downloadURL);
        };

        const fetchUser = async () => {
            if (currentUser.uid) {
                try {
                    const userData = await getUser(currentUser.uid);
                    setUser(userData);

                    setName(userData?.name || '');
                    setSurname(userData?.surname || '');
                    setEmail(userData?.email || '');
                    setPhone(userData?.phone || '');
                    setForehand(userData?.forehand || '');
                    setBestShot(userData?.bestShot || '');

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

    const checkValidity = () : Boolean => {
        updatedData = {};
        let formErrors = {
            name: "",
            surname: "",
            birthDate: "",
            email: "",
            phone: "",
            forehand: "",
            bestShot: ""
        };
        let formValid = true;

        if (name != user.name) {
            if (!name) {
                formErrors.name = "Il nome è obbligatorio.";
                formValid = false;
            } else {
                updatedData.name = name;
            }
        }

        if (surname != user.surname) {
            if (!surname) {
                formErrors.surname = "Il cognome è obbligatorio.";
                formValid = false;
            } else {
                updatedData.surname = surname;
            }
        }

        if (email != user.email) {
            if (!email || !/\S+@\S+\.\S+/.test(email)) {
                formErrors.email = "Inserisci un'email valida.";
                formValid = false;
            } else {
                updatedData.email = email;
            }
        }

        if (phone != user.phone) {
            if (!phone || !/^\d{10}$/.test(phone)) {
                formErrors.phone = "Inserisci un numero di telefono valido.";
                formValid = false;
            } else {
                updatedData.phone = phone;
            }
        }

        if (forehand != user.forehand) {
            if (!forehand) {
                formErrors.forehand = "Seleziona il lato del diritto.";
                formValid = false;
            } else {
                updatedData.forehand = forehand;
            }
        }

        if(bestShot != user.bestShot) {
            if (!bestShot) {
                formErrors.bestShot = "Seleziona il colpo preferito.";
                formValid = false;
            } else {
                updatedData.bestShot = bestShot;
            }
        }

        setFormErrors(formErrors);
        return formValid;
    }

    const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (checkValidity() === false) {
            return;
        }
        else {
            setUpdating(true);
            setShowModal(true);

            console.log("Edit form valid")
            setName(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
            setSurname(surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase())
        }

        try {
            const docRef = doc(db, "users", currentUser.uid);

            if ((imagePreview || imagePreview=="") && profileImageURL) {
                const imageRef = ref(storage, profileImageURL)
                await deleteObject(imageRef)
                console.log("image deleted")
                updatedData.profileImage = await uploadImage(image, currentUser.uid);
            } else if (imagePreview != "" && !profileImageURL) {
                updatedData.profileImage = await uploadImage(image, currentUser.uid);
            }

            setUpdating(true);
            setShowModal(true);
            await updateDoc(docRef, updatedData)
            setUpdating(false);

            console.log("Document successfully updated!");
        } catch (err) {
            console.error("Error getting document: ", err);
        }
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
        if (imagePreview != null && imagePreview != "") return (
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
        else if (imagePreview == "" || profileImageURL == "") return (
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
        <Container fluid style={{width: "100%"}} className="d-flex flex-column justify-content-center text-center m-0 p-0">
            <MyNavbar/>
            <Container fluid className="justify-content-center mt-4 p-0" style={{width: isScreenSmall ? "100%" : "80%"}}>
                <Modal show={showModal}>
                    <Modal.Body>
                        <h5 className="my-font">
                            {updating ? "Aggiornamento in corso..." : "Profilo aggiornato con successo!"}
                        </h5>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button disabled={updating} className="my-button" variant="primary"
                                style={{
                                    width: isScreenSmall ? '50%' : '20%',
                                    minHeight: '40px',
                                }}
                                onClick={() => navigate(`/account/${currentUser.uid}`)}>
                            <h6 className="my-font" style={{ pointerEvents: "none" }}>
                                chiudi
                            </h6>
                        </Button>
                    </Modal.Footer>
                </Modal>
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
                        <Button className="my-button mt-4" variant="primary"
                                style={{
                                    width: isScreenSmall ? '50%' : '20%',
                                    minHeight: '40px',
                                }}
                                onClick={() => handleSelectImage()}>
                            <h4 className="my-font" style={{ pointerEvents: "none" }}>
                                Cambia immagine
                            </h4>
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button className="my-button-outlined mt-4" variant="primary"
                                style={{
                                    width: isScreenSmall ? '50%' : '20%',
                                    minHeight: '40px',
                                }}
                                onClick={() => {
                                    setImage(null);
                                    setImagePreview("");
                                }}>
                            <h4 className="my-font" style={{ pointerEvents: "none" }}>
                                Rimuovi immagine
                            </h4>
                        </Button>
                    </Col>
                </Row>
                <Form noValidate className="mt-4" style={{ width: '100%' }} validated={validated} onSubmit={handleEdit}>
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
                                    style={FormStyle}
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
                                    style={FormStyle}
                                    onChange={(e) => setSurname(e.target.value)}
                                    isInvalid={!!formErrors.surname}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.surname}
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
                    <Row className="d-flex justify-content-between mx-5 mt-5 mb-4">
                        <Button className="my-button mt-4 p-2" variant="primary" type="submit"
                                style={{
                                    width: isScreenSmall ? '40%' : '25%',
                                    minHeight: '60px',
                                    marginLeft: isScreenSmall ? '' : '120px'
                                }}>
                            <h4 className="my-font" style={{ pointerEvents: "none" }}>
                                Conferma modifiche
                            </h4>
                        </Button>
                        <Button className="my-button-outlined mt-4 p-1" variant="primary"
                                style={{
                                    width: isScreenSmall ? '40%' : '25%',
                                    minHeight: '60px',
                                    marginRight: isScreenSmall ? '' : '120px'
                                }}
                                onClick={() => navigate(-1)}>
                            <h4 className="my-font" style={{ pointerEvents: "none" }}>
                                Indietro
                            </h4>
                        </Button>
                    </Row>
                </Form>
            </Container>
        </Container>
    );
}

export default EditAccount;