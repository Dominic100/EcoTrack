import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc, updateDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import Papa from 'papaparse';
import SmartPlug from './SmartPlug';
import { useUser } from './UserContext'; // Import the useUser hook
import 'bootstrap/dist/css/bootstrap.min.css';

const DeviceInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate hook
    const { username } = useUser(); // Get the username from context
    const [deviceData, setDeviceData] = useState(null);
    const [carbonEmission, setCarbonEmission] = useState(null);
    const [csvData, setCsvData] = useState([]);
    const [deviceID, setDeviceID] = useState(id);
    const [powerConsumed, setPowerConsumed] = useState('');
    const [time, setTime] = useState({ hours: 0, minutes: 0 });
    const [efData, setEfData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedEF, setSelectedEF] = useState(null);
    const [calculatedEmissions, setCalculatedEmissions] = useState(null);

    useEffect(() => {
        console.log('Fetching device data for ID:', id);
        const fetchDeviceData = async () => {
            try {
                const docRef = doc(db, 'devices', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    console.log('Device data:', docSnap.data());
                    setDeviceData(docSnap.data());
                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error fetching device data:', error);
            }
        };

        fetchDeviceData();
    }, [id]);

    useEffect(() => {
        console.log('Loading CSV data for manufacturing emissions');
        Papa.parse(`${process.env.PUBLIC_URL}/Final_data.csv`, {
            download: true,
            header: true,
            complete: (results) => {
                console.log('CSV data loaded:', results.data);
                setCsvData(results.data);
            },
            error: (error) => {
                console.error('Error loading CSV file:', error);
            }
        });
    }, []);

    useEffect(() => {
        console.log('Loading EF data');
        const fetchEfData = async () => {
            try {
                const response = await fetch('/EF_Electricity_Grid.csv');
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        console.log('EF data loaded:', result.data);
                        const filteredData = result.data.filter(item => item.Country); // Ensure country is defined
                        setEfData(filteredData);
                    },
                });
            } catch (error) {
                console.error('Error fetching EF data:', error);
            }
        };

        fetchEfData();
    }, []);

    useEffect(() => {
        if (deviceData && csvData.length > 0) {
            const { type, manufacturer, model } = deviceData;

            console.log('Calculating manufacturing emission for device:', {
                type,
                manufacturer,
                model,
            });

            // Calculate manufacturing carbon emission
            const selectedData = csvData.find(item =>
                item.subcategory === type &&
                item.manufacturer === manufacturer &&
                item.name.trim() === model
            );

            if (selectedData) {
                const { lifetime, gwp_total } = selectedData;
                const emission = parseFloat(lifetime) * parseFloat(gwp_total);
                console.log('Calculated manufacturing emission:', emission);
                setCarbonEmission(emission);

                // Update the document with the new emission value
                const updateDeviceData = async () => {
                    try {
                        const docRef = doc(db, 'devices', id);
                        await updateDoc(docRef, { MFEmissions: emission });
                        console.log('Document updated with MFEmissions:', emission);
                    } catch (error) {
                        console.error('Error updating document:', error);
                    }
                };

                updateDeviceData();
            } else {
                console.log('No matching data found for the device.');
                setCarbonEmission(null);
            }
        }
    }, [deviceData, csvData, id]);

    const handleCalculateEmissions = async () => {
        // Validate inputs
        if (!powerConsumed || !time.hours || !selectedEF) {
            console.error('Missing input values: power consumed, time, or EF data.');
            return;
        }

        // Calculate energy consumed in kWh
        const energyConsumed = (parseFloat(powerConsumed) || 0) * (parseFloat(time.hours) + parseFloat(time.minutes) / 60);
        console.log('Energy consumed:', energyConsumed);

        if (isNaN(energyConsumed)) {
            console.error('Invalid energy calculation.');
            return;
        }

        // Calculate carbon emissions
        const emissions = energyConsumed * (selectedEF || 0);
        console.log('Calculated carbon emissions:', emissions);
        setCalculatedEmissions(emissions);

        // Calculate total time elapsed
        const timeElapsed = `${time.hours} hours ${time.minutes} minutes`;

        // Store the calculated emissions in the usageEmissions collection
        if (username && emissions !== null) {
            try {
                await addDoc(collection(db, 'usageEmissions'), {
                    username: username,
                    deviceID: deviceID, // Store the deviceID
                    USEmissions: emissions,
                    timeElapsed: timeElapsed,
                    timestamp: Timestamp.now(),
                });
                console.log('Emissions data stored successfully.');
            } catch (error) {
                console.error('Error storing emissions data:', error);
            }
        }
    };

    const handleCountryChange = (e) => {
        const country = e.target.value;
        setSelectedCountry(country);

        console.log('Selected country:', country);

        // Find the EF for the selected country
        const countryData = efData.find(item => item.Country === country);
        if (countryData) {
            setSelectedEF(countryData.EF);
            console.log('Selected EF:', countryData.EF);
        } else {
            setSelectedEF(null);
        }
    };

    const handleNavigateToVisualization = () => {
        console.log('Navigating to visualization with ID:', id);
        navigate(`/visualization/${id}`);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Device Information</h2>

            <div className="card mb-4">
                <div className="card-body">
                    <h3>Manufacturing Emissions</h3>
                    {carbonEmission !== null ? (
                        <p>Calculated Manufacturing Emission: <strong>{carbonEmission.toFixed(2)} kg CO2e</strong></p>
                    ) : (
                        <p>No data available for emission calculation.</p>
                    )}
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h3>Indirect Power Consumption Emissions</h3>
                    <SmartPlug deviceID={deviceID} />
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h3>Usage Emissions</h3>
                    <form>
                        <div className="form-group mb-3">
                            <label htmlFor="powerConsumed">Power Consumed (kW):</label>
                            <input
                                id="powerConsumed"
                                type="number"
                                className="form-control"
                                value={powerConsumed}
                                onChange={(e) => setPowerConsumed(e.target.value)}
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label>Time Used:</label>
                            <div className="d-flex">
                                <input
                                    type="number"
                                    className="form-control me-2"
                                    placeholder="Hours"
                                    value={time.hours}
                                    onChange={(e) => setTime({ ...time, hours: e.target.value })}
                                />
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Minutes"
                                    value={time.minutes}
                                    onChange={(e) => setTime({ ...time, minutes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="country-select">Select a country:</label>
                            <select
                                id="country-select"
                                className="form-select"
                                value={selectedCountry}
                                onChange={handleCountryChange}
                            >
                                <option value="" disabled>Select a country</option>
                                {efData.map((item, index) => (
                                    <option key={index} value={item.Country}>{item.Country}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleCalculateEmissions}
                        >
                            Calculate Emissions
                        </button>

                        {calculatedEmissions !== null && (
                            <div className="mt-3">
                                <p>Total Carbon Emissions: <strong>{calculatedEmissions.toFixed(2)} kg CO2e</strong></p>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <button className="btn btn-info mt-4" onClick={handleNavigateToVisualization}>
                Go to Visualization
            </button>
        </div>
    );
};

export default DeviceInfo;
