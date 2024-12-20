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

export type { Player, Match, Score };