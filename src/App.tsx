import React, {useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {Col, Container } from 'react-bootstrap';
import { storage } from './firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './login/login'
import Main from './main'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Container fluid className="App p-0">
                <Routes>
                    <Route path="/*" element={<Login/>}/>
                    <Route path="/main" element={<Main/>}/>
                </Routes>
            </Container>
        </BrowserRouter>
    );
}

export default App;