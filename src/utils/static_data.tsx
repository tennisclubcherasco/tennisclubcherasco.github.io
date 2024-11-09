import { Player, Match } from "../utils/types";

const players: Array<Player> = [
    {
        id: 0,
        nome: "Marco",
        cognome: "Rossi",
        eta: 28,
        ranking: 5,
        bestRanking: 3,
        punteggio: 1200
    },
    {
        id: 1,
        nome: "Luca",
        cognome: "Bianchi",
        eta: 34,
        ranking: 8,
        bestRanking: 5,
        punteggio: 1150
    },
    {
        id: 2,
        nome: "Giulia",
        cognome: "Verdi",
        eta: 25,
        ranking: 3,
        bestRanking: 2,
        punteggio: 1300
    },
    {
        id: 3,
        nome: "Sara",
        cognome: "Neri",
        eta: 31,
        ranking: 7,
        bestRanking: 4,
        punteggio: 1180
    },
    {
        id: 4,
        nome: "Francesco",
        cognome: "Gialli",
        eta: 29,
        ranking: 2,
        bestRanking: 1,
        punteggio: 1350
    },
    {
        id: 5,
        nome: "Elena",
        cognome: "Grigi",
        eta: 27,
        ranking: 4,
        bestRanking: 3,
        punteggio: 1220
    },
    {
        id: 6,
        nome: "Andrea",
        cognome: "Blu",
        eta: 30,
        ranking: 6,
        bestRanking: 4,
        punteggio: 1175
    },
    {
        id: 7,
        nome: "Marta",
        cognome: "Rosa",
        eta: 26,
        ranking: 9,
        bestRanking: 6,
        punteggio: 1100
    },
    {
        id: 8,
        nome: "Fabio",
        cognome: "Viola",
        eta: 33,
        ranking: 10,
        bestRanking: 7,
        punteggio: 1050
    },
    {
        id: 9,
        nome: "Chiara",
        cognome: "Marrone",
        eta: 24,
        ranking: 1,
        bestRanking: 1,
        punteggio: 1400
    }
];

const matches: Array<Match> = [
    {
        id: 1,
        player1ID: 1,
        player2ID: 2,
        score: "6-4, 7-5",
        date: "2023-11-01",
    },
    {
        id: 2,
        player1ID: 3,
        player2ID: 4,
        score: "4-6, 6-3, 7-6, 4-6, 6-4",
        date: "2023-11-02",
    },
    {
        id: 3,
        player1ID: 5,
        player2ID: 6,
        score: "3-6, 6-4",
        date: "2023-11-03",
    },
    {
        id: 4,
        player1ID: 7,
        player2ID: 8,
        score: "6-1, 6-0",
        date: "2023-11-04",
    },
    {
        id: 5,
        player1ID: 9,
        player2ID: 0,
        score: "7-5, 5-7",
        date: "2023-11-05",
    }
];

export { players, matches };