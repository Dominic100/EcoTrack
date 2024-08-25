// DashDeviceCard.js
import React from 'react';
import styled from 'styled-components';

const DashDeviceCard = ({ type, company, model, onClick }) => {
    return (
        <Card onClick={onClick}>
            <h3>{type}</h3>
            <p><strong>Company:</strong> {company}</p>
            <p><strong>Model:</strong> {model}</p>
        </Card>
    );
};

const Card = styled.div`
    background-color: #444;
    border-radius: 10px;
    padding: 15px;
    width: 220px;
    text-align: center;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    cursor: pointer;

    &:hover {
        background-color: #555;
    }
`;

export default DashDeviceCard;
