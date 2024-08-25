import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { useUser } from './UserContext';
import { db } from './firebase';
import styled from 'styled-components';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setUsername: setUser } = useUser(); // Get setUsername from context

    const handleLogin = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'userData'));
            let isAuthenticated = false;

            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                if (userData.username === username && userData.password === password) {
                    isAuthenticated = true;
                    setUser(username); // Set the username in context
                }
            });

            if (isAuthenticated) {
                navigate('/');
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <FormContainer>
            <h2>Login</h2>
            <FormGroup>
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </FormGroup>
            <FormGroup>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormGroup>
            <button onClick={handleLogin}>Login</button>
        </FormContainer>
    );
};

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
`;

const FormGroup = styled.div`
    margin-bottom: 20px;
`;

export default Login;
