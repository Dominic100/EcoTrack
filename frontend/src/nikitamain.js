import React from 'react';
import styled from 'styled-components';
import DeviceCard from './DeviceCard';

const devices = [
    { id: 1, name: 'Heart Rate Monitor', image: '/images/HeartRate.jpg' },
    { id: 2, name: 'Blood Pressure Monitor', image: '/images/BPMonitor.jpeg' },
    { id: 3, name: 'MRI Machine', image: '/images/MRI.jpeg' },
    { id: 4, name: 'Mobile', image: '/images/mobile.jpeg' }
];

const App = () => {
    return (
        <Container>
            <Header>CHOOSE YOUR DEVICE</Header>
            <DeviceGrid>
                {devices.map((device) => (
                    <DeviceCard key={device.id} name={device.name} image={device.image} />
                ))}
            </DeviceGrid>
            <BlogSection>BLOGS</BlogSection>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: #212121;
    color: white;
    min-height: 100vh;
    padding: 20px;
`;

const Header = styled.h1`
    margin-bottom: 40px;
    font-size: 3em;
    color: #f39c12;
    text-transform: uppercase;
`;

const DeviceGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 30px;
    max-width: 1200px;
    width: 100%;
    margin-bottom: 40px;
`;

const BlogSection = styled.div`
    font-size: 24px;
    background-color: #333;
    padding: 20px;
    border-radius: 10px;
    max-width: 800px;
    width: 100%;
    text-align: center;
    color: #f39c12;
`;

export default App;