import {Button} from "react-bootstrap";
import {collection, deleteDoc, doc, getDocs, setDoc} from "firebase/firestore";
import {db} from "../firebaseConfig";

const SpecialButton = () => {

    async function addStatsToAllUsers() {
        try {
            const collectionRef = collection(db, "users");
            const querySnap = await getDocs(collectionRef);

            const updatePromises = querySnap.docs.map(async (document) => {
                const statsDocRef = doc(db, "users", document.id, "stats", "playerStats");

                await setDoc(statsDocRef, {
                    matches: 0,
                    win: 0,
                    lose: 0,
                    ties: 0
                });
            });

            await Promise.all(updatePromises);
            console.log("Stats added to all users successfully.");
        } catch (error) {
            console.error("Error adding stats to users:", error);
        }
    }

    async function addStats() {
        const querySnap = await getDocs(collection(db, "users"));

        const addPromises = querySnap.docs.map((document) => {
            setDoc(doc(db, "users", document.id, "stats", "playerStats"), {
                matches: 0,
                win: 0,
                lose: 0,
                ties: 0
            })
        })
        await Promise.all(addPromises);
    }

    return (
        <>
            <Button className="my-button-outlined" variant="primary"
                    style={{
                        width: '50%',
                        minHeight: '40px',
                    }}
                    onClick={() => addStatsToAllUsers()}>
                <h5 className="my-font" style={{ pointerEvents: "none" }}>
                    Special
                </h5>
            </Button>
        </>
    )
}

export default SpecialButton;