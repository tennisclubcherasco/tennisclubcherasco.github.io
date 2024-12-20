import {getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {db, storage } from "../firebaseConfig";
import AccountIcon from "./account_icon";
import { Container } from "react-bootstrap";

const uploadImage = async (
    image: File | null,
    userId: string,
): Promise<string> => {
    if (!image) {
        console.log("immagine non fornita");
        return "";
    }
    if (!userId) {
        throw new Error("userID non fornito");
    }

    const storageRef = ref(storage, `profile-images/${userId}-${image.name}`);

    try {
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    } catch (error) {
        console.error("Errore durante il caricamento:", error);
        throw new Error("C'è stato un errore durante il caricamento.");
    }
};

const ImageHandler = ({ size, imageUrl, onClick, backColor }: { size: number, imageUrl: string | null, onClick?: () => void, backColor: string }) => {
    if(imageUrl === null || imageUrl === "") {
        return (
            <AccountIcon size={size}/>
        )
    } else {
        return (
            <Container className="p-0"
                       style={{
                           width: (size+6) + "px", // Larghezza del cerchio
                           height: (size+6) + "px", // Altezza del cerchio (uguale alla larghezza)
                           borderRadius: "50%", // Trasforma il container in un cerchio
                           backgroundColor: backColor, // Colore di sfondo
                           display: "flex", // Centrare contenuti all'interno
                           alignItems: "center", // Centrare verticalmente
                           justifyContent: "center", // Centrare orizzontalmente
                           boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Aggiungi un'ombra opzionale
                       }}
            >
                <Container className="p-0"
                           style={{
                               width: size + "px",
                               height: size + "px",
                               borderRadius: "50%",
                               overflow: "hidden",
                               cursor: onClick ? "pointer" : "default",
                           }}
                           onClick={onClick}
                >
                    <img
                        src={imageUrl}
                        alt="Anteprima immagine"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            cursor: onClick ? "pointer" : "default",
                        }}
                    />
                </Container>
            </Container>
        )
    }
}

export { uploadImage, ImageHandler };