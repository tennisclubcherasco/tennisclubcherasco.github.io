import { Player } from "../utils/types";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getAllUsers } from "../utils/get_data";
import TableEntry from "./table_entry";

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
                            <TableEntry player={player} isScreenSmall={isScreenSmall}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

export default Ranking;