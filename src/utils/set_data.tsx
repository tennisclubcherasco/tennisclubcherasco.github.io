import {H2H, Player, Score} from "./types";
import {calcPlayerScore, getWinner, UpdateRanking} from "./score_ranking";
import {
    DocumentData, QueryDocumentSnapshot,
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where, getDoc
} from "firebase/firestore";
import {db} from "../firebaseConfig";
import {getStats} from "./get_data";

//PLAYERS
async function updateStats(uid: string, uid2: string, winnerId: string | null) {
    const p1StatsRef = doc(db, "users", uid, "stats", "playerStats")
    const p2StatsRef = doc(db, "users", uid2, "stats", "playerStats")

    const P1stats = await getStats(uid);
    const P2stats = await getStats(uid2);

    if (P1stats != null && P2stats != null){
        if (winnerId === uid) {
            await updateDoc(p1StatsRef, {matches: P1stats.matches + 1, win: P1stats.win + 1});
            await updateDoc(p2StatsRef, {matches: P2stats.matches + 1, lose: P2stats.lose + 1});
        } else if (winnerId === uid2) {
            await updateDoc(p1StatsRef, {matches: P1stats.matches + 1, lose: P1stats.lose + 1});
            await updateDoc(p2StatsRef, {matches: P2stats.matches + 1, win: P2stats.win + 1});
        } else {
            await updateDoc(p1StatsRef, {matches: P1stats.matches + 1, ties: P1stats.ties + 1});
            await updateDoc(p2StatsRef, {matches: P2stats.matches + 1, ties: P2stats.ties + 1});
        }
    }
}

// MATCH
async function newMatch(player1: Player, player2: Player, score: Score, date: string) {
    const scoreString = score.map((set) => set.player1 + "-" + set.player2).join(" ");
    const winner = getWinner(scoreString);
    const winnerId = winner === 1 ? player1.uid : (winner === 2 ? player2.uid : null);
    const playerMatchScores = calcPlayerScore(player1, player2, winner);

    const newMatch = {
        player1ID: player1.uid,
        player2ID: player2.uid,
        score: scoreString,
        date: date,
        p1Score: playerMatchScores.p1matchScore,
        p2Score: playerMatchScores.p2matchScore
    }

    const p1Ref = doc(db, "users", player1.uid);
    const p2Ref = doc(db, "users", player2.uid);

    const p1UpdatedScore = {score: player1.score + playerMatchScores.p1matchScore}
    const p2UpdatedScore = {score: player2.score + playerMatchScores.p2matchScore}

    await addDoc(collection(db, "matches"), newMatch);
    console.log("Match added successfully");
    await updateDoc(p1Ref, p1UpdatedScore);
    await updateDoc(p2Ref, p2UpdatedScore);
    console.log("Players' scores updated successfully");
    await updateStats(player1.uid, player2.uid, winnerId);
    console.log("Players' stats updated successfully");
    await UpdateRanking();
    console.log("Ranking updated successfully");

    const q = query(
        collection(db, "H2H"),
        where("player1", "in", [player1.uid, player2.uid]),
        where("player2", "in", [player1.uid, player2.uid])
    );

    const querySnapshot1 = await getDocs(q).then();

    if (querySnapshot1.empty) {
        await newH2H(player1.uid, player2.uid);
    }

    const querySnapshot2 = await getDocs(q).then();
    await updateH2H(querySnapshot2.docs[0], winnerId);
}

// H2H
async function newH2H(p1: string, p2: string) {
    await addDoc(collection(db, "H2H"), {
        player1: p1,
        player2: p2,
        winsP1: 0,
        winsP2: 0,
        ties: 0
    })
}

async function updateH2H(doc: QueryDocumentSnapshot<DocumentData, DocumentData>, winnerId: string | null) {
    let updatedData: {};
    if (winnerId === doc.data().player1) {
        updatedData = {winsP1: doc.data().winsP1 + 1}
    } else if (winnerId === doc.data().player2) {
        updatedData = {winsP2: doc.data().winsP2 + 1}
    } else {
        updatedData = {ties: doc.data().ties + 1}
    }

    await updateDoc(doc.ref, updatedData);
}

export { newMatch }