import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

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

export { getUser };