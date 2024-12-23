import { Player } from "./types";

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

export { getWinner, calcPlayerScore };