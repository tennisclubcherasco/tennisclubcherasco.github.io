import './App.css';
import {Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './login/login'
import Register from './login/register'
import PlayerAccount from './account/account_info'
import { Main } from './main/main'
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import EditAccount from './account/edit_account';
import NewMatch from './new_match/new_match';
import HEAD2HEAD from "./h2h/h2h";

function App() {
    return (
        <AuthProvider>
            <HashRouter basename={process.env.PUBLIC_URL}>
                <Container fluid className="App p-0">
                    <Routes>
                        <Route path="/" element={<Login/>}/>
                        <Route path="/main" element={<Main/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/account/:userId" element={<PlayerAccount/>}/>
                        <Route path="/account/:userId/edit" element={<EditAccount/>}/>
                        <Route path="/newMatch" element={<NewMatch/>}/>
                        <Route path="/H2H/:player2ID?" element={<HEAD2HEAD/>}/>
                    </Routes>
                </Container>
            </HashRouter>
        </AuthProvider>
    );
}

export default App;