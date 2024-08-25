import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { useUser } from './UserContext'; // Import the useUser hook

ChartJS.register(Title, Tooltip, Legend, ArcElement, LineElement, CategoryScale, LinearScale, PointElement);

const Visualization = () => {
    const { id } = useParams(); // Device ID from URL params
    const { username } = useUser(); // Get the username from context
    const [mfEmissions, setMfEmissions] = useState(0);
    const [pieData, setPieData] = useState([]);
    const [totalEmissions, setTotalEmissions] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [pcEmissions, setPcEmissions] = useState(null);
    const [totalPcEmissions, setTotalPcEmissions] = useState(null);
    const [mostRecentPcEmissions, setMostRecentPcEmissions] = useState(null);
    const [lineChartData, setLineChartData] = useState(null);
    const [usageEmissions, setUsageEmissions] = useState(null);
    const [totalUsageEmissions, setTotalUsageEmissions] = useState(null);
    const [mostRecentUsageEmissions, setMostRecentUsageEmissions] = useState(null);
    const [usageLineChartData, setUsageLineChartData] = useState(null);

    useEffect(() => {
        if (!username) return; // Ensure username is available

        // Fetch all devices for the current user
        const fetchUserDevices = async () => {
            try {
                console.log('Fetched id: ', id);
                console.log('Fetching user devices...');
                const q = query(collection(db, 'devices'), where('username', '==', username));
                const querySnapshot = await getDocs(q);
                const emissionsData = [];
                let total = 0;
                let currentDeviceEmissions = 0;

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const { MFEmissions, manufacturer, model } = data;

                    if (MFEmissions) {
                        const isCurrentDevice = doc.id === id; // Check if this is the current device
                        if (isCurrentDevice) {
                            currentDeviceEmissions = MFEmissions; // Store current device emissions
                        }
                        emissionsData.push({
                            label: `${manufacturer} - ${model}`,
                            value: MFEmissions,
                        });
                        total += MFEmissions;
                    }
                });

                setPieData(emissionsData);
                setTotalEmissions(total);

                if (total > 0) { // Ensure total > 0 to avoid division by zero
                    setPercentage((currentDeviceEmissions / total) * 100);
                } else {
                    setPercentage(0);
                }

                setMfEmissions(currentDeviceEmissions);

            } catch (error) {
                console.error('Error fetching user devices:', error);
            }
        };

        // Fetch Power Consumption Emissions for the current device
        const fetchPcEmissions = async () => {
            try {
                console.log('Fetching power consumption emissions...');
                const q = query(collection(db, 'chargingEmissions'), where('deviceID', '==', id));
                const querySnapshot = await getDocs(q);
                let total = 0;
                let mostRecentEmission = null;
                const emissionsArray = [];
                const timestampsArray = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const { PCEmissions, timestamp } = data;

                    if (PCEmissions) {
                        total += PCEmissions;
                        emissionsArray.push(PCEmissions);

                        // Format the timestamp to only show date and time
                        const formattedDate = new Date(timestamp.seconds * 1000).toLocaleString();
                        timestampsArray.push(formattedDate);

                        if (!mostRecentEmission || timestamp > mostRecentEmission.timestamp) {
                            mostRecentEmission = { PCEmissions, timestamp };
                        }
                    }
                });

                // Reverse the arrays to show the oldest on the left and recent on the right
                emissionsArray.reverse();
                timestampsArray.reverse();

                setTotalPcEmissions(total);
                setMostRecentPcEmissions(mostRecentEmission?.PCEmissions || null);

                if (querySnapshot.size === 1) {
                    setPcEmissions(total);
                }

                // Prepare data for the line chart
                setLineChartData({
                    labels: timestampsArray,
                    datasets: [{
                        label: 'PCEmissions (kg CO2e)',
                        data: emissionsArray,
                        fill: false,
                        borderColor: 'rgba(75,192,192,1)',
                        tension: 0.1,
                    }]
                });
            } catch (error) {
                console.error('Error fetching power consumption emissions:', error);
            }
        };

        // Fetch Usage Emissions for the current device
        const fetchUsageEmissions = async () => {
            try {
                console.log('Fetching usage emissions...');
                const q = query(collection(db, 'usageEmissions'), where('deviceID', '==', id));
                const querySnapshot = await getDocs(q);
                let total = 0;
                let mostRecentEmission = null;
                const emissionsArray = [];
                const timestampsArray = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const { USEmissions, timestamp } = data;

                    if (USEmissions) {
                        total += USEmissions;
                        emissionsArray.push(USEmissions);

                        // Format the timestamp to only show date and time
                        const formattedDate = new Date(timestamp.seconds * 1000).toLocaleString();
                        timestampsArray.push(formattedDate);

                        if (!mostRecentEmission || timestamp > mostRecentEmission.timestamp) {
                            mostRecentEmission = { USEmissions, timestamp };
                        }
                    }
                });

                // Reverse the arrays to show the oldest on the left and recent on the right
                emissionsArray.reverse();
                timestampsArray.reverse();

                setTotalUsageEmissions(total);
                setMostRecentUsageEmissions(mostRecentEmission?.USEmissions || null);

                if (querySnapshot.size === 1) {
                    setUsageEmissions(total);
                }

                // Prepare data for the line chart
                setUsageLineChartData({
                    labels: timestampsArray,
                    datasets: [{
                        label: 'USEmissions (kg CO2e)',
                        data: emissionsArray,
                        fill: false,
                        borderColor: 'rgba(192,75,192,1)',
                        tension: 0.1,
                    }]
                });
            } catch (error) {
                console.error('Error fetching usage emissions:', error);
            }
        };

        fetchUserDevices();
        fetchPcEmissions();
        fetchUsageEmissions();
    }, [username, id]);

    // Pie chart data and options
    const pieChartData = {
        labels: pieData.map(data => data.label),
        datasets: [
            {
                data: pieData.map(data => data.value),
                backgroundColor: pieData.map((_, index) => `hsl(${index * 360 / pieData.length}, 70%, 50%)`), // Dynamic colors
            },
        ],
    };

    console.log('Pie chart data:', pieChartData);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Visualization</h2>

            <div className="card mb-4">
                <div className="card-body">
                    <h3>Manufacturing Emissions</h3>
                    <p>Total Manufacturing Emissions: <strong>{totalEmissions.toFixed(2)} kg CO2e</strong></p>
                    <p>Current Device Manufacturing Emissions: <strong>{mfEmissions.toFixed(2)} kg CO2e</strong></p>
                    <p>Percentage of Current Device Emissions: <strong>{percentage.toFixed(2)}%</strong></p>
                    {pieData.length > 0 && (
                        <div className="mt-4">
                            <h4>Manufacturing Emissions Distribution</h4>
                            <Pie data={pieChartData} />
                        </div>
                    )}
                </div>
            </div>

            {/* Section 2: Power Consumption Emissions */}
            <div className="card mb-4">
                <div className="card-body">
                    <h3>Power Consumption Emissions</h3>
                    {pcEmissions !== null ? (
                        <p>Carbon Emissions due to Power Consumption: <strong>{pcEmissions.toFixed(2)} kg CO2e</strong></p>
                    ) : (
                        <>
                            <p>Most Recent Power Consumption Emission: <strong>{mostRecentPcEmissions?.toFixed(4)} kg CO2e</strong></p>
                            <p>Total Power Consumption Emissions: <strong>{totalPcEmissions?.toFixed(4)} kg CO2e</strong></p>
                        </>
                    )}
                    {lineChartData && (
                        <div className="mt-4">
                            <h4>Power Consumption Emissions Over Time</h4>
                            <Line data={lineChartData} />
                        </div>
                    )}
                </div>
            </div>

            {/* Section 3: Usage Emissions */}
            <div className="card mb-4">
                <div className="card-body">
                    <h3>Usage Emissions</h3>
                    {usageEmissions !== null ? (
                        <p>Carbon Emissions due to Usage: <strong>{usageEmissions.toFixed(2)} kg CO2e</strong></p>
                    ) : (
                        <>
                            <p>Most Recent Usage Emission: <strong>{mostRecentUsageEmissions?.toFixed(4)} kg CO2e</strong></p>
                            <p>Total Usage Emissions: <strong>{totalUsageEmissions?.toFixed(4)} kg CO2e</strong></p>
                        </>
                    )}
                    {usageLineChartData && (
                        <div className="mt-4">
                            <h4>Usage Emissions Over Time</h4>
                            <Line data={usageLineChartData} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Visualization;
