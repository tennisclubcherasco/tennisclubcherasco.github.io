import { Player } from "../utils/types";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FaUserCircle } from "react-icons/fa";
import { Container } from "react-bootstrap";
import { players } from "../utils/static_data";

const Ranking: React.FC<{ isScreenSmall: Boolean }> = ({isScreenSmall}) => {

    const TableEntry = ({ player }: { player: Player }) => {
        const CircleWithNumber: React.FC<{ color: string; bordercolor: string; number: number }> = ({ color, bordercolor, number }) => {
            let size = '50px'
            return (
                <div className="" style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    borderRadius: "50%",
                    borderWidth: "3px",
                    borderColor: bordercolor,
                    borderStyle: "solid",
                    display: "inline-block",
                    textAlign: "center",
                    color: "white",
                    fontSize: "1.5em",
                    fontWeight: "bold",
                    verticalAlign: "middle",
                }}>
                    {number}
                </div>
            );
        };

        const Rank = ({ player }: { player: Player }) => {
            return(
                <TableCell align="center" component="th" scope="row" style={{fontSize: "1.2em", fontFamily: "Oswald"}}>
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
                <TableCell className={isScreenSmall ? "p-0" : ""} align="left" style={{fontSize: isScreenSmall ? "1.2em" : "1.5em", fontFamily: "Oswald"}}>
                    <FaUserCircle className="me-3" style={{ width: '45px', height:'auto', color: 'black' }} />
                    {player.nome + " " + player.cognome}
                </TableCell>
                {!isScreenSmall && <TableCell align="center" style={{fontSize: "1.2em"}}>{player.eta}</TableCell>}
                {!isScreenSmall && <TableCell align="center" style={{fontSize: "1.2em"}}>{player.bestRanking}</TableCell>}
                <TableCell className={isScreenSmall ? "p-0" : ""} align="center" style={{fontSize: isScreenSmall ? "1.0em" : "1.2em"}}>{player.punteggio}</TableCell>
            </TableRow>
        )
    }

    return(
        <Container className={isScreenSmall ? "d-flex flex-column p-0" : "d-flex flex-column"}>
            <TableContainer>
                <Table aria-label="">
                    <TableHead>
                        <TableRow >
                            <TableCell align="center" style={{fontSize: "1.2em", fontFamily: "Oswald"}}>Ranking</TableCell>
                            <TableCell align="left" style={{fontSize: "1.2em", fontFamily: "Oswald"}}>Player</TableCell>
                            {!isScreenSmall && <TableCell align="center" style={{fontSize: "1.2em", fontFamily: "Oswald"}}>Età</TableCell>}
                            {!isScreenSmall && <TableCell align="center" style={{fontSize: "1.2em", fontFamily: "Oswald"}}>Best Ranking</TableCell>}
                            <TableCell align="center" style={{fontSize: "1.2em", fontFamily: "Oswald"}}>Punteggio</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {players.sort((a, b) => a.ranking - b.ranking).map((player) => (
                            <TableEntry player={player}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

export default Ranking;