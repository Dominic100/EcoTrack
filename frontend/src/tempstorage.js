// src/App.js
import React from 'react';
import Navbar from './Navbar';
import MainContent from './MainContent';
import styled from 'styled-components';

function App() {
    return (
        <AppContainer>
            <Navbar />
            <MainContent />
        </AppContainer>
    );
}

const AppContainer = styled.div`
  font-family: Arial, 'sans-serif';
  color: #333;
`;

export default App;