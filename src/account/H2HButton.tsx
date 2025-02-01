import {Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface EditButtonProps {
    player2: string | undefined;
}

const H2HButton: React.FC<EditButtonProps> = ({ player2 }) => {
    const navigate = useNavigate();

    if(player2) {
        return(
            <Row>
                <Col className="p-0 mt-2">
                    <Button className="my-button mt-4" variant="primary" type="submit"
                            style={{
                                width: '50%',
                                minHeight: '60px',
                            }}
                            onClick={() => navigate(`/H2H/${player2}`)}>
                        <h4 className="my-font" style={{ pointerEvents: "none" }}>
                            Testa a testa
                        </h4>
                    </Button>
                </Col>
            </Row>
        )
    } else {
        return(<></>)
    }
}

export default H2HButton;