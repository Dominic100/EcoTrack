import React from 'react';
import styled from 'styled-components';

const DeviceCard = ({ name, image, onClick }) => {
    return (
        <Card onClick={onClick}>
            <DeviceImage src={image} alt={name} />
            <DeviceName>{name}</DeviceName>
        </Card>
    );
};

const Card = styled.div`
    background-color: #333;
    border-radius: 15px;
    overflow: hidden;
    width: 220px;
    text-align: center;
    cursor: pointer;
    margin-bottom: 20px;
`;

const DeviceImage = styled.img`
    width: 100%;
    height: 180px;
    object-fit: cover;
`;

const DeviceName = styled.div`
    padding: 10px;
    font-size: 18px;
    color: white; /* Ensure text color is visible against the background */
    background-color: #333; /* Background color to ensure contrast */
`;

export default DeviceCard;
