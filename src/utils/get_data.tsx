import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import {getDownloadURL, ref } from "firebase/storage";

async function getUser(userId: string) {
    try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        return null;
    }
}

const downloadImageFromStorage = async (imageUrl: string): Promise<string | null> => {
    try {
        const storageRef = ref(storage, imageUrl); // Usa l'URL salvato in Firestore come riferimento nel Firebase Storage
        const downloadURL = await getDownloadURL(storageRef); // Ottieni l'URL di download

        return downloadURL;
    } catch (error) {
        console.error("Error downloading image from Firebase Storage: ", error);
        return null;
    }
};

export { getUser, downloadImageFromStorage };