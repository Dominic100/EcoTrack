// Leaderboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/leaderboard');
                setLeaderboardData(response.data);
            } catch (err) {
                setError('Error fetching leaderboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboardData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="leaderboard">
            <h1>Leaderboard</h1>
            <ul>
                {leaderboardData.map((entry, index) => (
                    <li key={index}>
                        <span>{index + 1}. </span>
                        <span>{entry.username} - </span>
                        <span>{entry.totalEmissions.toFixed(2)} kg CO2e</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
