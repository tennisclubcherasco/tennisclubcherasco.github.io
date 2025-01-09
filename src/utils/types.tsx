type Player = {
    uid: string;
    name: string;
    surname: string;
    birthDate: string;
    email: string;
    phone: string;
    ranking: number;
    bestRanking: number;
    score: number;
    forehand: string;
    bestShot: string;
    profileImage: string;
};

type Match = {
    id: string;
    player1ID: string;
    player2ID: string;
    score: string;
    date: string;
};

type Score = {
    setNumber: number;
    player1: number;
    player2: number;
}[];

type H2H = {
    id: string;
    player1: string;
    player2: string;
    winsP1: number;
    winsP2: number;
    ties: number;
}

type PlayerStats = {
    matches: number;
    win: number;
    lose: number;
    ties: number;
}

export type { Player, Match, Score, H2H, PlayerStats };