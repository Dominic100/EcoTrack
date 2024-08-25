import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import DashDeviceCard from './DashDeviceCard';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
    const [devices, setDevices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'devices'));
                const devicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDevices(devicesData);
            } catch (error) {
                console.error('Error fetching devices:', error);
            }
        };

        fetchDevices();
    }, []);

    const handleAddDevice = () => {
        navigate('/add-device');
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleCardClick = (device) => {
        navigate(`/device-info/${device.id}`);
    };

    return (
        <Container className="d-flex flex-column align-items-center my-5">
            <Row className="w-100 mb-5">
                <Col className="d-flex justify-content-center">
                    <Card
                        className="p-4 w-75 text-center shadow rounded"
                        style={{ backgroundColor: '#f8f9fa' }} // Lighter background color
                    >
                        <Card.Body>
                            <Card.Title className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                Add Device
                            </Card.Title>
                            <Button
                                variant="primary"
                                onClick={handleAddDevice}
                                style={{ padding: '10px 20px', fontSize: '1.2rem' }}
                            >
                                Add a Device
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="w-100 mb-5">
                <Col className="d-flex justify-content-center">
                    <Card
                        className="p-4 w-75 text-center shadow rounded"
                        style={{ backgroundColor: '#f8f9fa' }} // Lighter background color
                    >
                        <Card.Body>
                            <Card.Title className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                My Devices
                            </Card.Title>
                            {devices.length > 0 ? (
                                <Row>
                                    {devices.map((device, index) => (
                                        <Col md={6} key={index} className="mb-4 d-flex justify-content-center">
                                            <DashDeviceCard
                                                type={device.type}
                                                company={device.manufacturer}
                                                model={device.model}
                                                onClick={() => handleCardClick(device)}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <p style={{ fontSize: '1.2rem', color: '#777' }}>No devices added yet.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="w-100">
                <Col className="d-flex justify-content-center">
                    <Button
                        variant="secondary"
                        onClick={handleBack}
                        style={{ padding: '10px 20px', fontSize: '1.2rem' }}
                    >
                        Back to Homepage
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
