import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { useUser } from './UserContext';
import { db } from './firebase';
import styled from 'styled-components';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const { setUsername: setUser } = useUser(); // Get setUsername from context

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await addDoc(collection(db, 'userData'), {
                username,
                password
            });
            setUser(username); // Set the username in context
            navigate('/');
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    return (
        <FormContainer>
            <h2>Register</h2>
            <FormGroup>
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </FormGroup>
            <FormGroup>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormGroup>
            <FormGroup>
                <label>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </FormGroup>
            <button onClick={handleRegister}>Register</button>
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

export default Register;
