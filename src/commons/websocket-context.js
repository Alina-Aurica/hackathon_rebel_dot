import React, { createContext, useState, useEffect, useRef } from 'react';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { HOST, endpoint } from './hosts'; // Adjust the path as necessary
import { useLocation } from 'react-router-dom'; // Import useLocation

export const WebSocketContext = createContext(null);

const WebSocketProviderBase = ({ children }) => {
    const location = useLocation(); // Use the useLocation hook
    const [stompClient, setStompClient] = useState(null);
    const [totalMessages, setTotalMessages] = useState([]);
    const [sendReadNotification, setSendReadNotification] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [userIdTyping, setUserIdTyping] = useState(null);
    const typingTimeoutRef = useRef(null);
    const TYPING_NOTIFICATION_TIMEOUT = 5000;

    useEffect(() => {
        // Log the current location
        console.log('Current location is:', location.pathname);

        // Check if the location is '/chat' to send read notifications
        if (location.pathname === '/chat') {
            sendReadNotificationStomp();
        } else {
            sessionStorage.setItem('selectedClientId', null);
        }
    }, [location]); // Update dependencies to include location

    // Main WebSocket connection and message processing
    useEffect(() => {
        // Grab the received messages from the session storage if any exist
        let storedMessages = sessionStorage.getItem('totalMessages');
        if (storedMessages) {
            setTotalMessages(JSON.parse(storedMessages));
        } else {
            console.log('No messages in session storage');
        }

        const socket = new SockJS(HOST.chat_api + endpoint.ws);
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            const userId = sessionStorage.getItem("id");
            stompClient.subscribe('/topic/' + userId, (notification) => {
                const message = JSON.parse(notification.body);
                switch (message.messageType) {
                    case 'text':
                        processMessageText(message);
                        break;
                    case 'read-notification':
                        processMessageReadNotification(message);
                        break;
                    case 'typing-notification':
                        processMessageTypingNotification(message);
                        break;
                    default:
                        console.log('Unknown message type:', message.messageType);
                }
            });
            setStompClient(stompClient);
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    // Process the reception of a text message
    const processMessageText = (message) => {
        const sourceUserId = message.sourceUserId;
        const chatMessage = message.message;

        setTotalMessages(prevMessages => {
            const updatedMessages = { ...prevMessages };
            updatedMessages[sourceUserId] = updatedMessages[sourceUserId] ? 
                [...updatedMessages[sourceUserId], chatMessage] : [chatMessage];
            sessionStorage.setItem('totalMessages', JSON.stringify(updatedMessages));
            return updatedMessages;
        });

        addUsername(sourceUserId, chatMessage);

        if (location.pathname === '/chat') {
            setSendReadNotification(true);
        }
    }

    // Process a message of type read notification, updating the current messages as being read
    const processMessageReadNotification = (message) => {
        let storedMessages = sessionStorage.getItem('totalMessages');
        
        if (storedMessages) {
            let messagesCopy = { ...JSON.parse(storedMessages) };
            if (messagesCopy[message.sourceUserId] !== undefined) {
                messagesCopy[message.sourceUserId] = messagesCopy[message.sourceUserId].map(m => {
                    if (m.status) {
                        m.status = 'read';
                    }
                    return m;
                });
                sessionStorage.setItem('totalMessages', JSON.stringify(messagesCopy));
                setTotalMessages(messagesCopy);
            }
        }
    }

    const processMessageTypingNotification = (message) => {
        console.log('The other user is typing...');
        setIsTyping(true);
        setUserIdTyping(message.sourceUserId);
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            setUserIdTyping(null);
            console.log('The other user stopped typing...');
        }, TYPING_NOTIFICATION_TIMEOUT);
    }

    const sendMessage = (destination, message) => {
        if (stompClient && stompClient.connected) {
            stompClient.send(destination, {}, JSON.stringify(message));
        } else {
            console.log('Stomp client not connected');
        }
    };

    const sendReadNotificationStomp = () => {
        const destinationUserId = sessionStorage.getItem('selectedClientId') || 'admin-user-id'; // Use admin's user ID as a fallback

        const newMessage = {
            id: Date.now(),
            title: sessionStorage.getItem('name'),
            userId: sessionStorage.getItem('id'),
            type: 'text',
            text: 'this is a notification, it should not be displayed',
        };

        const toSend = {
            message: newMessage,
            sourceUserId: sessionStorage.getItem("id"),
            destinationUserId: destinationUserId,
            messageType: 'read-notification'
        };

        sendMessage("/app/greeting", toSend);
    };

    // Add the received username to session storage
    const addUsername = (sourceUserId, chatMessage) => {
        const storedUserNames = sessionStorage.getItem('userNames');
        if (storedUserNames) {
            sessionStorage.setItem('userNames', JSON.stringify({ 
                ...JSON.parse(storedUserNames), 
                [sourceUserId]: chatMessage.title 
            }));
        } else {
            sessionStorage.setItem('userNames', JSON.stringify({ [sourceUserId]: chatMessage.title }));
        }
    }

    return (
        <WebSocketContext.Provider value={{
            stompClient,
            sendMessage,
            totalMessages,
            setTotalMessages,
            sendReadNotificationStomp,
            isTyping,
            userIdTyping
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const WebSocketProvider = WebSocketProviderBase;
