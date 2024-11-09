type Player = {
    id: number;
    nome: string;
    cognome: string;
    eta: number;
    ranking: number;
    bestRanking: number;
    punteggio: number;
};

type Match = {
    id: number;
    player1ID: number;
    player2ID: number;
    score: string;
    date: string;
}

export type { Player, Match };