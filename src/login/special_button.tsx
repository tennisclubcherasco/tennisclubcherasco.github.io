import {Button} from "react-bootstrap";
import {collection, deleteDoc, doc, getDocs, setDoc} from "firebase/firestore";
import {db} from "../firebaseConfig";

const SpecialButton = () => {

    async function deleteAllDocument() {
        const collectionRef = collection(db, "users");
        const querySnap = await getDocs(collectionRef);

        const addPromises = querySnap.docs.map((document) => {
            deleteDoc(doc(db, "users", document.id, "stats", "playerStats"));
        })
        await Promise.all(addPromises);
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
                    onClick={() => addStats()}>
                <h5 className="my-font" style={{ pointerEvents: "none" }}>
                    Special
                </h5>
            </Button>
        </>
    )
}

export default SpecialButton;