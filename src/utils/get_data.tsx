import {collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import {getDownloadURL, ref } from "firebase/storage";
import { Player } from "./types";

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

async function getAllUsers() {
    try {
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(usersCollectionRef);

        const users: Player[] = querySnapshot.docs.map((doc) => ({
            uid: doc.id,
            name: doc.data().name,
            surname: doc.data().surname,
            birthDate: doc.data().birthDate,
            email: doc.data().email,
            phone: doc.data().phone,
            ranking: doc.data().ranking,
            bestRanking: doc.data().bestRanking,
            score: doc.data().score,
            forehand: doc.data().forehand,
            bestShot: doc.data().bestShot,
            profileImage: doc.data().profileImage,
        }));

        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
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

const fetchProfileImage = async (profileImagePath: string) => {
    if (profileImagePath) {
        try {
            const downloadURL = await downloadImageFromStorage(profileImagePath);
            return downloadURL;
        } catch (error) {
            console.error("Error fetching profile image:", error);
        }
    }
}

export { getUser, getAllUsers, downloadImageFromStorage, fetchProfileImage };