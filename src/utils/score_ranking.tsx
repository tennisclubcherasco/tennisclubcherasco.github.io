import {Player} from "./types";
import {getAllUsers} from "./get_data";
import {collection, doc, getDocs, query, where, writeBatch} from "firebase/firestore";
import {db} from "../firebaseConfig";

function getWinner(scoreString: string){
    const sets = scoreString.split(" ");
    let p1score = 0;
    let p2score = 0;

    for(const set of sets) {
        const games = set.split("-");
        if(games[0] > games[1]) p1score++;
        else p2score++;
    }

    if (p1score > p2score) return 1;
    else if (p1score < p2score) return 2;
    else return 0;
}

function expProb(p1: number, p2: number){
    return 1 / (1 + Math.pow(10, (p1 - p2)/400));
}

function calcPlayerScore(player1: Player, player2: Player, winner: number) {
    const expProb1 = expProb(player2.score, player1.score);
    const s1 = winner === 1 ? 1 : winner === 0 ? 0.5 : 0;
    const s2 = winner === 2 ? 1 : winner === 0 ? 0.5 : 0;

    const p1matchScore = s1 - expProb1;
    const p2matchScore = s2 - (1 - expProb1);

    return {
        p1matchScore: p1matchScore < 0 ? Math.floor(p1matchScore * 50) : Math.ceil(p1matchScore * 50),
        p2matchScore: p2matchScore < 0 ? Math.floor(p2matchScore * 50) : Math.ceil(p2matchScore * 50)
    };
}

async function switchPlayers(player1: Player, player2: Player) {
    const q = query(
        collection(db, "H2H"),
        where("player1", "in", [player1.uid, player2.uid]),
        where("player2", "in", [player1.uid, player2.uid])
    );

    const querySnapshot = await getDocs(q).then();

    if (!querySnapshot.empty) {
        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            console.log("Scontro diretto trovato", data);

            if (data.winsP1 === data.winsP2) {
                return false;
            } else if (player1.uid === data.player1 && data.winsP1 > data.winsP2) {
                return false;
            } else if (player1.uid === data.player2 && data.winsP2 > data.winsP1) {
                return false;
            }
        }
    } else {
        return false
    }

    return true;
}

const UpdateRanking = async () => {
    let allPlayers: Player[] = await getAllUsers();
    const batch = writeBatch(db);

    allPlayers.sort((a, b) => b.score - a.score);

    const switchPromises = [];
    for (let index = 0; index < allPlayers.length - 1; index++) {
        if (allPlayers[index].score === allPlayers[index + 1].score) {
            switchPromises.push(
                switchPlayers(allPlayers[index], allPlayers[index + 1]).then(switchNeeded => {
                    if (switchNeeded) {
                        const temp = allPlayers[index];
                        allPlayers[index] = allPlayers[index + 1];
                        allPlayers[index + 1] = temp;
                    }
                })
            );
        }
    }

    await Promise.all(switchPromises);

    for (let index = 0; index < allPlayers.length; index++) {
        const player = allPlayers[index];
        const newRank = index + 1;

        if (player.ranking !== newRank) {
            const playerRef = doc(db, "users", player.uid);
            batch.update(playerRef, {ranking: newRank})
            if (newRank < player.bestRanking || player.bestRanking == null) {
                batch.update(playerRef, {bestRanking: newRank})
            }
        }
    }

    try {
        await batch.commit();
        console.log("Ranking aggiornato con successo!");
    } catch (e) {
        console.error("Errore durante l'aggiornamento del ranking: ", e);
    }
}

export { getWinner, calcPlayerScore, UpdateRanking };