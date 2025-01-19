import { TableCell, TableRow } from "@mui/material";
import { Player } from "../utils/types";
import { useEffect, useState } from "react";
import { fetchProfileImage } from "../utils/get_data";
import { ImageHandler } from "../utils/image_handler";
import { calculateAge } from "../utils/utility";
import {useNavigate} from "react-router-dom";

interface TableEntryProps {
    player: Player;
    isScreenSmall: Boolean;
}

const TableEntry: React.FC<TableEntryProps> = ({ player, isScreenSmall }) => {
    const navigate = useNavigate();
    const [profileImageURL, setProfileImageURL] = useState<string | null>(null);

    useEffect(() => {
        if (player) {
            const loadProfileImage = async (imageURL: string) => {
                const downloadURL = await fetchProfileImage(imageURL);
                if(downloadURL) setProfileImageURL(downloadURL);
            }

            loadProfileImage(player.profileImage);
        } else {
            setProfileImageURL(null);
        }
    }, [player]);

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
                    fontSize: isScreenSmall ? "1.1em" : "1.5em",
                    fontFamily: "Oswald",
                    padding: "0",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                }}
            >
                <div
                    style={{ display: "inline-block", verticalAlign: "middle", width: "45px", marginRight: "10px", cursor: "pointer"}}
                    onClick={() => navigate(`/account/${player.uid}`)}
                >
                    <ImageHandler size={45} imageUrl={profileImageURL} backColor={"#2f7157"} onClick={() => navigate(`/account/${player.uid}`)}/>
                </div>
                <div className="ms-2"
                    style={{ display: "inline-block", verticalAlign: "middle", wordBreak: "break-word", cursor: "pointer"}}
                    onClick={() => navigate(`/account/${player.uid}`)}
                >
                    {player.name}
                    {isScreenSmall ? <br/> : " "}
                    {player.surname}
                </div>
            </TableCell>
            {!isScreenSmall && <TableCell align="center" style={{fontSize: "1.2em"}}>{calculateAge(player.birthDate)}</TableCell>}
            {!isScreenSmall && <TableCell align="center" style={{fontSize: "1.2em"}}>{player.bestRanking}</TableCell>}
            <TableCell className={isScreenSmall ? "p-0" : ""} align="center" style={{fontSize: isScreenSmall ? "1.0em" : "1.2em"}}>{player.score}</TableCell>
        </TableRow>
    )
}

export default TableEntry;