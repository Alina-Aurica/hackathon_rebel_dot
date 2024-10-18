import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { HOST, endpoint } from './hosts';
import { Alert } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const WebSocketComponent = () => {
    const [stompClient, setStompClient] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState(null);
    const location = useLocation();

    const hideNotification = () => {
        setShowNotification(false);
    };

    useEffect(() => {
        const socket = new SockJS(`${HOST.monitoring_api}${endpoint.ws}`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (msg) => { console.log(msg); },
            onConnect: (frame) => {
                console.log('Connected: ' + frame);
                client.subscribe('/topic', (notification) => {
                    const allowedPaths = ['/device-consumption', '/home', '/user-devices'];
                    if (allowedPaths.includes(location.pathname)) {
                        const message = JSON.parse(notification.body);
                        const sessionId = sessionStorage.getItem("id");
                        if (message.userId === sessionId) {
                            console.log('Received WebSocket Notification: ', message);
                            setMessage(message.message);
                            setShowNotification(true);
                        }
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            }
        });

        client.activate(); // Activate the client
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate(); // Properly deactivate the client on unmount
                console.log('Disconnected');
            }
        };
    }, [location.pathname]);

    return (
        <div>
            {showNotification && (
                <Alert variant="danger" onClose={hideNotification} dismissible>
                    {message || "The hourly energy data for the device is above the maximum!"}
                </Alert>
            )}
        </div>
    );
};

export default WebSocketComponent;
