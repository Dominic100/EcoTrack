import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useUser } from './UserContext'; // Import the UserContext
import { Container, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddDevicePage = () => {
    const [data, setData] = useState([]);
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [deviceModels, setDeviceModels] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const navigate = useNavigate();
    const { username } = useUser(); // Get username from context

    useEffect(() => {
        Papa.parse(`${process.env.PUBLIC_URL}/Final_data.csv`, {
            download: true,
            header: true,
            complete: (results) => {
                const parsedData = results.data;
                setData(parsedData);

                // Extract unique device types
                const uniqueTypes = [...new Set(parsedData.map(item => item.subcategory || ''))];
                setDeviceTypes(uniqueTypes);

                // Extract unique manufacturers
                const uniqueManufacturers = [...new Set(parsedData.map(item => item.manufacturer || ''))];
                setManufacturers(uniqueManufacturers);

                // Extract unique models
                const uniqueModels = [...new Set(parsedData.map(item => item.name ? item.name.trim() : ''))];
                setDeviceModels(uniqueModels);
            },
            error: (error) => {
                console.error("Error loading the CSV file:", error);
            }
        });
    }, []);

    useEffect(() => {
        if (selectedType) {
            const filteredManufacturers = [...new Set(data
                .filter(item => item.subcategory === selectedType)
                .map(item => item.manufacturer || ''))
            ];
            setManufacturers(filteredManufacturers);
            setSelectedManufacturer('');
            setSelectedModel('');
        }
    }, [selectedType, data]);

    useEffect(() => {
        if (selectedManufacturer) {
            const filteredModels = [...new Set(data
                .filter(item => item.subcategory === selectedType && item.manufacturer === selectedManufacturer)
                .map(item => item.name ? item.name.trim() : ''))
            ];
            setDeviceModels(filteredModels);
            setSelectedModel('');
        }
    }, [selectedManufacturer, selectedType, data]);

    const handleAddDevice = async () => {
        if (selectedType && selectedManufacturer && selectedModel) {
            try {
                await addDoc(collection(db, 'devices'), {
                    type: selectedType,
                    manufacturer: selectedManufacturer,
                    model: selectedModel,
                    username: username // Include username here
                });
                navigate('/dashboard');
            } catch (error) {
                console.error('Error adding device:', error);
            }
        } else {
            alert('Please select all fields');
        }
    };

    return (
        <Container className="d-flex flex-column align-items-center mt-5">
            <Card className="p-4 w-100" style={{ maxWidth: '500px', backgroundColor: '#444', color: '#fff' }}>
                <Card.Body>
                    <Card.Title className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        Add a Device
                    </Card.Title>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Device Type</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="">Select a device type</option>
                                {deviceTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Company</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedManufacturer}
                                onChange={(e) => setSelectedManufacturer(e.target.value)}
                                disabled={!selectedType}
                            >
                                <option value="">Select a company</option>
                                {manufacturers.map((manufacturer, index) => (
                                    <option key={index} value={manufacturer}>{manufacturer}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Device Model</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                disabled={!selectedManufacturer}
                            >
                                <option value="">Select a device model</option>
                                {deviceModels.map((model, index) => (
                                    <option key={index} value={model}>{model}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Button
                            variant="primary"
                            onClick={handleAddDevice}
                            className="w-100"
                        >
                            Add Device
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddDevicePage;
