import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Papa from 'papaparse';
import { Container, Row, Col, Card } from 'react-bootstrap'; // Import Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import DeviceCard from './DeviceCard';

const CarbonEmissionCalculator = () => {
    const [data, setData] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        // Load CSV data
        Papa.parse(`${process.env.PUBLIC_URL}/Final_data.csv`, {
            download: true,
            header: true,
            complete: (results) => {
                const parsedData = results.data;

                // Extract and clean up subcategories
                const uniqueSubcategories = [...new Set(parsedData.map(item => item.subcategory))];

                // Remove last element if it's undefined
                if (uniqueSubcategories[uniqueSubcategories.length - 1] === undefined) {
                    uniqueSubcategories.pop();
                }

                setSubcategories(uniqueSubcategories);
                setData(parsedData);
            },
            error: (error) => {
                console.error("Error loading the CSV file:", error);
            }
        });
    }, []);

    const handleCardClick = (subcategory) => {
        navigate(`/device/${subcategory}`); // Navigate to the new page
    };

    return (
        <Container>
            <h2 className="my-4">How much did your device actually cost?</h2>
            <Row className="g-4">
                {subcategories.map((subcategory, index) => (
                    <Col md={4} lg={3} key={index}>
                        <Card className="h-100" onClick={() => handleCardClick(subcategory)} style={{ cursor: 'pointer' }}>
                            <Card.Img variant="top" src={`/images/${subcategory}.jpg`} alt={subcategory} />
                            <Card.Body>
                                <Card.Title>{subcategory}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default CarbonEmissionCalculator;
