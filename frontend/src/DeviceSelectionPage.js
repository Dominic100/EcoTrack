import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Papa from 'papaparse';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'; // Import Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const DeviceSelectionPage = () => {
    const { subcategory } = useParams();
    const [data, setData] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [deviceModels, setDeviceModels] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [selectedDeviceModel, setSelectedDeviceModel] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        Papa.parse(`${process.env.PUBLIC_URL}/Final_data.csv`, {
            download: true,
            header: true,
            complete: (results) => {
                const parsedData = results.data.filter(item => item.subcategory === subcategory);
                setData(parsedData);
                const filteredManufacturers = [...new Set(parsedData.map(item => item.manufacturer))];
                setManufacturers(filteredManufacturers);
            },
            error: (error) => {
                console.error("Error loading the CSV file:", error);
            }
        });
    }, [subcategory]);

    useEffect(() => {
        if (selectedManufacturer) {
            const filteredModels = data
                .filter(item => item.manufacturer === selectedManufacturer)
                .map(item => item.name.trim());
            setDeviceModels([...new Set(filteredModels)]);
        }
    }, [selectedManufacturer, data]);

    const handleProceed = () => {
        navigate(`/device/${subcategory}/details`, {
            state: { selectedManufacturer, selectedDeviceModel }
        });
    };

    const handleBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <Container className="my-4">
            <Card>
                <Card.Body>
                    <Card.Title>Select Device Details</Card.Title>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Company</Form.Label>
                            <Form.Select
                                value={selectedManufacturer}
                                onChange={(e) => setSelectedManufacturer(e.target.value)}
                            >
                                <option value="">Select a company</option>
                                {manufacturers.map((manufacturer, index) => (
                                    <option key={index} value={manufacturer}>{manufacturer}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Device Model</Form.Label>
                            <Form.Select
                                value={selectedDeviceModel}
                                onChange={(e) => setSelectedDeviceModel(e.target.value)}
                                disabled={!selectedManufacturer}
                            >
                                <option value="">Select a device model</option>
                                {deviceModels.map((model, index) => (
                                    <option key={index} value={model}>{model}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Button
                            variant="primary"
                            onClick={handleProceed}
                            disabled={!selectedDeviceModel}
                            className="me-2"
                        >
                            Proceed
                        </Button>
                        <Button variant="secondary" onClick={handleBack}>
                            Back
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DeviceSelectionPage;
