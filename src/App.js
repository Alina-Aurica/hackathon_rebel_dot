import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavigationBar from './navigation-bar';
import Home from './home/home';
import Chat from './chat/chat';
import styles from './commons/styles/project-style.css';
import UserContainer from './user/user-container';
import Login from './commons/auth/login';
import Map from './commons/map'

import WebSocketComponent from './commons/websocket';
import { WebSocketProvider } from './commons/websocket-context';

const App = () => {
    return (
        <div className={styles.back}>
            <Router>
                <div>
                    <NavigationBar />
                    <WebSocketComponent />
                    {/* Wrap Routes with WebSocketProvider */}
                    <WebSocketProvider>
                        <Routes>
                            {/* Redirect root path to /login */}
                            <Route path="/" element={<Navigate to="/login" />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/chat" element={<Chat />} />
                            <Route path="/map" element={<Map />} />
                            <Route path="/user" element={<UserContainer />} />
                        </Routes>
                    </WebSocketProvider>
                </div>
            </Router>
        </div>
    );
};

export default App;
