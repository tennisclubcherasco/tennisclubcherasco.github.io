import { Container } from "react-bootstrap";
import MyNavbar from "../navbar/navbar";

function MyAccount() {
    return (
        <Container fluid style={{height: "", width: "100%"}} className="d-flex flex-column justify-content-center text-center m-0 p-0">
            <MyNavbar/>
        </Container>
    );
}

export default MyAccount;