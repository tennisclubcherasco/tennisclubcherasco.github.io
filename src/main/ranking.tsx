import { Player } from "../utils/types";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FaUserCircle } from "react-icons/fa";
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getAllUsers } from "../utils/get_data";

const Ranking: React.FC<{ isScreenSmall: Boolean }> = ({isScreenSmall}) => {
    const pad = isScreenSmall ? "p-2" : ""
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            const users = await getAllUsers();
            setAllPlayers(users);
        };

        fetchAllUsers();
    }, []);

    const TableEntry = ({ player }: { player: Player }) => {
        const CircleWithNumber: React.FC<{ color: string; bordercolor: string; number: number }> = ({ color, bordercolor, number }) => {
            let size = isScreenSmall ? '35px' : '50px'
            return (
                <div
                    style={{
                        width: size,
                        height: size,
                        backgroundColor: color,
                        borderRadius: "50%",
                        borderWidth: "3px",
                        borderColor: bordercolor,
                        borderStyle: "solid",
                        display: "inline-block",
                        textAlign: "center",
                        position: "relative", // Necessario per il centering fine
                        verticalAlign: "middle", // Per mantenere l'allineamento generale
                    }}
                >
            <span
                style={{
                    position: "absolute", // Posizionamento assoluto per centrare
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)", // Trasla al centro esatto
                    color: "white",
                    fontSize: isScreenSmall ? "1em" : "1.5em",
                    fontWeight: "bold",
                }}
            >
                {number}
            </span>
                </div>
            );
        };

        const Rank = ({ player }: { player: Player }) => {
            return(
                <TableCell className="p-0" align="center" component="th" scope="row" style={{fontSize: "1.2em", fontFamily: "Oswald"}}>
                    {player.ranking === 1 ? (
                        <CircleWithNumber color="gold" bordercolor="#C8AF46" number={player.ranking} />
                    ) : player.ranking === 2 ? (
                        <CircleWithNumber color="silver" bordercolor="#9A9A9A" number={player.ranking} />
                    ) : player.ranking === 3 ? (
                        <CircleWithNumber color="#cd7f32" bordercolor="#7E561A" number={player.ranking} />
                    ) : (
                        player.ranking
                    )}
                </TableCell>
            )
        }

        return(
            <TableRow key={player.ranking} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} style={{height:"90px"}}>
                <Rank player={player}/>
                <TableCell
                    className={isScreenSmall ? "p-0" : ""}
                    align="left"
                    style={{
                        fontSize: isScreenSmall ? "1.2em" : "1.5em",
                        fontFamily: "Oswald",
                        padding: "0", // Elimina padding extra se necessario
                        wordWrap: "break-word", // Permette la rottura delle parole
                        whiteSpace: "normal", // Permette al testo di andare a capo
                    }}
                >
                    <div style={{ display: "inline-block", verticalAlign: "middle", width: "45px", marginRight: "10px" }}>
                        <FaUserCircle style={{ width: isScreenSmall ? '35px' : '45px', height: 'auto', color: 'black' }} />
                    </div>
                    <div style={{ display: "inline-block", verticalAlign: "middle", wordBreak: "break-word" }}>
                        {player.name}
                        {isScreenSmall ? <br/> : " "}
                        {player.surname}
                    </div>
                </TableCell>
                {!isScreenSmall && <TableCell align="center" style={{fontSize: "1.2em"}}>{player.birthDate}</TableCell>}
                {!isScreenSmall && <TableCell align="center" style={{fontSize: "1.2em"}}>{player.bestRanking}</TableCell>}
                <TableCell className={isScreenSmall ? "p-0" : ""} align="center" style={{fontSize: isScreenSmall ? "1.0em" : "1.2em"}}>{player.score}</TableCell>
            </TableRow>
        )
    }

    return(
        <Container className={isScreenSmall ? "d-flex flex-column p-0" : "d-flex flex-column"}>
            <TableContainer>
                <Table aria-label="">
                    <TableHead>
                        <TableRow >
                            <TableCell className={pad} align="center" style={{fontSize: "1.2em", fontFamily: "Oswald", width: "15%"}}>Ranking</TableCell>
                            <TableCell className={pad} align={isScreenSmall ? "center" : "left"} style={{fontSize: "1.2em", fontFamily: "Oswald"}}>Player</TableCell>
                            {!isScreenSmall && <TableCell align="center" style={{fontSize: "1.2em", fontFamily: "Oswald"}}>Età</TableCell>}
                            {!isScreenSmall && <TableCell align="center" style={{fontSize: "1.2em", fontFamily: "Oswald"}}>Best Ranking</TableCell>}
                            <TableCell align="center" style={{fontSize: "1.2em", fontFamily: "Oswald"}}>Punteggio</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allPlayers.sort((a, b) => a.ranking - b.ranking).map((player) => (
                            <TableEntry player={player}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

export default Ranking;