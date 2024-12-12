import {getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {db, storage } from "../firebaseConfig";

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

export { uploadImage };