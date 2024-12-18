import {Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface EditButtonProps {
    currentUserId: string;
}

const EditButton: React.FC<EditButtonProps> = ({ currentUserId }) => {
    const navigate = useNavigate();

    return(
        <Row>
            <Col className="p-0 mt-2">
                <Button className="my-button mt-4" variant="primary" type="submit"
                        style={{
                            width: '50%',
                            minHeight: '60px',
                        }}
                        onClick={() => navigate(`/account/${currentUserId}/edit`)}>
                    <h4 className="my-font" style={{ pointerEvents: "none" }}>
                        Modifica profilo
                    </h4>
                </Button>
            </Col>
        </Row>
    )
}

export default EditButton;