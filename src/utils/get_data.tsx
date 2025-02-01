import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {db, storage} from "../firebaseConfig";
import {getDownloadURL, ref} from "firebase/storage";
import {H2H, Match, Player, PlayerStats} from "./types";

// USERS
async function getUser(userId: string): Promise<Player | null> {
    try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return {
                uid: userDoc.data().uid,
                name: userDoc.data().name,
                surname: userDoc.data().surname,
                birthDate: userDoc.data().birthDate,
                email: userDoc.data().email,
                phone: userDoc.data().phone,
                ranking: userDoc.data().ranking,
                bestRanking: userDoc.data().bestRanking,
                score: userDoc.data().score,
                forehand: userDoc.data().forehand,
                bestShot: userDoc.data().bestShot,
                profileImage: userDoc.data().profileImage,
            };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document: ", error);
        return null;
    }
}

async function getStats(userId: string): Promise<PlayerStats | null> {
    try {
        const statsDocRef = doc(db, "users", userId, "stats", "playerStats");
        const statsDoc = await getDoc(statsDocRef);

        if (statsDoc.exists()) {
            return {
                matches: statsDoc.data().matches,
                win: statsDoc.data().win,
                lose: statsDoc.data().lose,
                ties: statsDoc.data().ties
            };
        } else {
            console.log("No stats document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document: ", error);
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
        console.error("Error fetching users: ", error);
        return [];
    }
}

// ----------------------------------------------------------------------------------------------------------------------------

// MATCHES
async function getLastNMatches(n: number) {
    try {
        const matchesCollectionRef = collection(db, "matches");
        const querySnapshot = await getDocs(matchesCollectionRef);

        const matches: Match[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            player1ID: doc.data().player1ID,
            player2ID: doc.data().player2ID,
            score: doc.data().score,
            date: doc.data().date,
        }));

        return matches.sort((m1, m2) => m1.date > m2.date ? -1 : 1).slice(0, n);
    } catch (error) {
        console.error("Error fetching matches: ", error);
        return [];
    }
}

async function getPlayerMatches(playerId: string) {
    try {
        const q = query(collection(db, "matches"),
            where("player1ID", "==", playerId) || where("player2ID", "==", playerId)
        )
        const querySnapshot = await getDocs(q);
        const matches: Match[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            player1ID: doc.data().player1ID,
            player2ID: doc.data().player2ID,
            score: doc.data().score,
            date: doc.data().date,
        }));
        return matches.sort((m1, m2) => m1.date > m2.date ? -1 : 1)
    } catch (error) {
        console.error("Error fetching player matches: ", error);
        return [];
    }
}

// ----------------------------------------------------------------------------------------------------------------------------

// H2H
async function getH2H(p1ID: string, p2ID: string) {
    try {
        const q1 = query(collection(db, "H2H"),
            where("player1", "==", p1ID),
            where("player2", "==", p2ID)
        );
        const q2 = query(collection(db, "H2H"),
            where("player1", "==", p2ID),
            where("player2", "==", p1ID)
        );

        const querySnapshot1 = await getDocs(q1);
        if (querySnapshot1.docs.length > 0) {
            const head2head: H2H[] = querySnapshot1.docs.map((doc) => ({
                id: doc.id,
                player1: doc.data().player1,
                player2: doc.data().player2,
                winsP1: doc.data().winsP1,
                winsP2: doc.data().winsP2,
                ties: doc.data().ties
            }));
            return head2head[0];
        }

        const querySnapshot2 = await getDocs(q2);
        if (querySnapshot2.docs.length > 0) {
            const head2head: H2H[] = querySnapshot2.docs.map((doc) => ({
                id: doc.id,
                player1: doc.data().player2,
                player2: doc.data().player1,
                winsP1: doc.data().winsP2,
                winsP2: doc.data().winsP1,
                ties: doc.data().ties
            }));
            return head2head[0];
        }

        return undefined;

    } catch (error) {
        console.error("Error downloading H2H: ", error);
        return undefined;
    }
}
// ----------------------------------------------------------------------------------------------------------------------------

// IMAGES
const downloadImageFromStorage = async (imageUrl: string): Promise<string | null> => {
    try {
        const storageRef = ref(storage, imageUrl); // Usa l'URL salvato in Firestore come riferimento nel Firebase Storage
        return await getDownloadURL(storageRef);
    } catch (error) {
        console.error("Error downloading image from Firebase Storage: ", error);
        return null;
    }
};

const fetchProfileImage = async (profileImagePath: string) => {
    if (profileImagePath) {
        try {
            return await downloadImageFromStorage(profileImagePath);
        } catch (error) {
            console.error("Error fetching profile image: ", error);
        }
    }
}

export { getUser, getStats, getAllUsers, getLastNMatches, getPlayerMatches, getH2H, downloadImageFromStorage, fetchProfileImage };