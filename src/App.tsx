import logo from './logo.svg';
import './App.css';
import {Col, Container } from 'react-bootstrap';
import { storage } from './firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './login/login'
import Register from './login/register'
import PlayerAccount from './account/my_account'
import { Main } from './main/main'
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import EditAccount from './account/edit_account';

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
                    </Routes>
                </Container>
            </HashRouter>
        </AuthProvider>
    );
}

export default App;