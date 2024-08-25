import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap'; // Import additional Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const DeviceDetailsPage = () => {
    const { state } = useLocation();
    const { selectedManufacturer, selectedDeviceModel } = state;
    const [carbonEmission, setCarbonEmission] = useState(null);
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load CSV data
        axios.get(`${process.env.PUBLIC_URL}/Final_data.csv`)
            .then(response => {
                Papa.parse(response.data, {
                    header: true,
                    complete: (results) => {
                        const parsedData = results.data;
                        setData(parsedData);
                        calculateCarbonEmission(parsedData);
                    }
                });
            })
            .catch(error => console.error("Error loading the CSV file:", error));
    }, []);

    const calculateCarbonEmission = (parsedData) => {
        const selectedData = parsedData.find(item =>
            item.manufacturer === selectedManufacturer && item.name.trim() === selectedDeviceModel
        );

        if (selectedData) {
            const { lifetime, gwp_total } = selectedData;
            const emission = parseFloat(lifetime) * parseFloat(gwp_total);
            setCarbonEmission(emission);
        } else {
            setCarbonEmission(null);
        }
    };

    const handleBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <Container className="my-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Device Details</Card.Title>
                            <Card.Subtitle className="mb-3 text-muted text-center">Manufacturing Emissions</Card.Subtitle>
                            {carbonEmission !== null ? (
                                <div className="text-center">
                                    <Alert variant="success">
                                        <h4>Calculated Carbon Emission: {carbonEmission.toFixed(2)} kg CO2e</h4>
                                    </Alert>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Alert variant="warning">Loading emissions data...</Alert>
                                </div>
                            )}
                            <div className="d-flex justify-content-center mt-4">
                                <Button variant="secondary" onClick={handleBack}>
                                    Back
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DeviceDetailsPage;
