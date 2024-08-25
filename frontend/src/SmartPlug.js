import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, orderBy, limit, query } from "firebase/firestore";
import { useUser } from './UserContext'; // Assuming you use a context to provide user information

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAJO0TQBIQ_yNfJk_2V3KOJNwFGhI2DL7A",
    authDomain: "ecotrack-86713.firebaseapp.com",
    projectId: "ecotrack-86713",
    storageBucket: "ecotrack-86713.appspot.com",
    messagingSenderId: "825480690778",
    appId: "1:825480690778:web:c63c1da442552ba8e6ec63",
    measurementId: "G-BXP19G146Z"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function SmartPlug({ deviceID }) {
    const [data, setData] = useState({ Vrms: 'Loading...', Irms: 'Loading...', Power: 'Loading...', kWh: 'Loading...' });
    const [storing, setStoring] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [status, setStatus] = useState('loading');
    const [startTime, setStartTime] = useState(null);
    const [latestReadings, setLatestReadings] = useState({ avgVrms: 'N/A', avgIrms: 'N/A', avgPower: 'N/A', avgkWh: 'N/A' });
    const [efData, setEfData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedEF, setSelectedEF] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(null);
    const { username } = useUser(); // Get username from context

    // Load and parse the EF CSV file
    useEffect(() => {
        const fetchEfData = async () => {
            try {
                const response = await fetch('/EF_Electricity_Grid.csv');
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        const filteredData = result.data
                            .filter(item => item.Country); // Ensure country is defined
                        setEfData(filteredData);
                    },
                });
            } catch (error) {
                console.error('Error fetching EF data:', error);
            }
        };

        fetchEfData();
    }, []);

    const handleCountryChange = async (e) => {
        const country = e.target.value;
        setSelectedCountry(country);

        // Find the EF for the selected country
        const countryData = efData.find(item => item.Country === country);
        if (countryData) {
            setSelectedEF(countryData.EF);

            // Calculate and store the Primary Carbon Emissions (PCE)
            const carbonEmissions = countryData.EF * latestReadings.avgkWh;

            try {
                // Store the PCE in the chargingEmissions collection
                await addDoc(collection(db, 'chargingEmissions'), {
                    deviceID: deviceID, // Ensure deviceID is passed correctly
                    PCEmissions: carbonEmissions,
                    energyConsumed: latestReadings.avgkWh,
                    elapsedTime: elapsedTime, // Include elapsed time
                    timestamp: new Date()
                });
                console.log('PCE stored successfully');
            } catch (error) {
                console.error('Error storing PCE:', error);
            }
        } else {
            setSelectedEF(null);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/data');
                if (response.data.status === 'connected') {
                    setData(response.data.data);
                    setStatus('connected');
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setStatus('error');
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

        return () => clearInterval(interval); // Clean up on component unmount
    }, []);

    const startStoringData = () => {
        if (!storing) {
            setStoring(true);
            setStartTime(new Date()); // Record start time

            const id = setInterval(async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/data');
                    if (response.data.status === 'connected') {
                        const { Vrms, Irms, Power, kWh } = response.data.data;

                        await addDoc(collection(db, 'energyData'), {
                            Vrms: parseFloat(Vrms),
                            Irms: parseFloat(Irms),
                            Power: parseFloat(Power),
                            kWh: parseFloat(kWh),
                            timestamp: new Date(),
                            username: username // Store username
                        });
                    }
                } catch (error) {
                    console.error('Error storing data:', error);
                }
            }, 5000); // Store data every 5 seconds
            setIntervalId(id);
        }
    };

    const stopStoringData = async () => {
        setStoring(false);
        if (intervalId) {
            clearInterval(intervalId);
        }

        try {
            // Retrieve all documents from energyData collection for this user
            const querySnapshot = await getDocs(collection(db, 'energyData'));
            let sumVrms = 0, sumIrms = 0, sumPower = 0, sumkWh = 0, count = 0;

            // Calculate the sums and count of the documents
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.username === username) { // Filter by username
                    sumVrms += data.Vrms || 0;
                    sumIrms += data.Irms || 0;
                    sumPower += data.Power || 0;
                    sumkWh += data.kWh || 0;
                    count++;
                }
            });

            if (count > 0) {
                // Calculate the averages
                const avgVrms = sumVrms / count;
                const avgIrms = sumIrms / count;
                const avgPower = sumPower / count;
                const avgkWh = sumkWh / count;

                // Calculate the time elapsed
                const endTime = new Date();
                const elapsed = (endTime - startTime) / 1000; // Time in seconds
                setElapsedTime(elapsed); // Update the state with elapsed time

                // Calculate carbon emissions
                const carbonEmissions = selectedEF ? selectedEF * avgkWh : 0;

                // Store the averages and elapsed time in a new collection
                await addDoc(collection(db, 'averageEnergyData'), {
                    avgVrms: isNaN(avgVrms) ? 0 : avgVrms,
                    avgIrms: isNaN(avgIrms) ? 0 : avgIrms,
                    avgPower: isNaN(avgPower) ? 0 : avgPower,
                    avgkWh: isNaN(avgkWh) ? 0 : avgkWh,
                    PCE: carbonEmissions, // Add the carbon emissions field
                    time: elapsed, // New field for elapsed time
                    username: username, // Store username
                    deviceID: deviceID, // Add deviceID field
                    timestamp: new Date()
                });
            }

            // Fetch the latest readings
            const avgQuery = query(
                collection(db, 'averageEnergyData'),
                orderBy('timestamp', 'desc'),
                limit(1)
            );
            const avgQuerySnapshot = await getDocs(avgQuery);

            if (!avgQuerySnapshot.empty) {
                const doc = avgQuerySnapshot.docs[0].data();
                setLatestReadings({
                    avgVrms: doc.avgVrms || 'N/A',
                    avgIrms: doc.avgIrms || 'N/A',
                    avgPower: doc.avgPower || 'N/A',
                    avgkWh: doc.avgkWh || 'N/A',
                    PCE: doc.PCE || 'N/A' // Include PCE in the latest readings
                });
            }

            // Delete all documents from the energyData collection only after storing the averages
            const deletePromises = querySnapshot.docs
                .filter(doc => doc.data().username === username) // Filter by username
                .map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

        } catch (error) {
            console.error('Error stopping data storage:', error);
        }
    };

    return (
        <div className="container my-4">
            <h4>Energy Monitoring</h4>
            <div className="card mb-4">
                <div className="card-body">
                    {status === 'connected' ? (
                        <>
                            <p><strong>Vrms:</strong> {data.Vrms} V</p>
                            <p><strong>Irms:</strong> {data.Irms} A</p>
                            <p><strong>Power:</strong> {data.Power} W</p>
                            <p><strong>kWh:</strong> {data.kWh} kWh</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>

            <h5>Country Emission Factor (EF)</h5>
            <div className="form-group">
                <label htmlFor="countrySelect">Select Country:</label>
                <select
                    id="countrySelect"
                    className="form-control"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                >
                    <option value="">Select a country</option>
                    {efData.sort((a, b) => a.Country.localeCompare(b.Country)).map((item, index) => (
                        <option key={index} value={item.Country}>{item.Country}</option>
                    ))}
                </select>
            </div>


            <div className="d-flex justify-content-between mt-4">
                <button
                    className={`btn ${storing ? 'btn-danger' : 'btn-primary'}`}
                    onClick={storing ? stopStoringData : startStoringData}
                >
                    {storing ? 'Stop Storing Data' : 'Start Storing Data'}
                </button>
            </div>

            {elapsedTime && (
                <div className="mt-3">
                    <h5>Latest Averages:</h5>
                    <p><strong>Average Vrms:</strong> {latestReadings.avgVrms} V</p>
                    <p><strong>Average Irms:</strong> {latestReadings.avgIrms} A</p>
                    <p><strong>Average Power:</strong> {latestReadings.avgPower} W</p>
                    <p><strong>Average kWh:</strong> {latestReadings.avgkWh} kWh</p>
                    <p><strong>Primary Carbon Emissions:</strong> {latestReadings.PCE} kg CO2e</p>
                    <p><strong>Elapsed Time:</strong> {elapsedTime} seconds</p>
                </div>
            )}

            <div className="mt-3">
                <p><strong>Selected Country:</strong> {selectedCountry}</p>
                <p><strong>EF:</strong> {selectedEF} kg CO2e/kWh</p>
            </div>
        </div>
    );
}

export default SmartPlug;
