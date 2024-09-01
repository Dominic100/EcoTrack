const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, setDoc } = require('firebase/firestore');

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAJO0TQBIQ_yNfJk_2V3KOJNwFGhI2DL7A",
    authDomain: "ecotrack-86713.firebaseapp.com",
    projectId: "ecotrack-86713",
    storageBucket: "ecotrack-86713.appspot.com",
    messagingSenderId: "825480690778",
    appId: "1:825480690778:web:c63c1da442552ba8e6ec63",
    measurementId: "G-BXP19G146Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const server = express(); // Changed from app to server
const port = 5001;

// Middleware
server.use(cors());
server.use(express.json());

// Function to get OpenText Bearer Token
const getBearerToken = async () => {
    const url = "https://us.api.opentext.com/tenants/6b844870-0c01-480d-b617-cda14ff7627a/oauth2/token";
    const username = "CnLP84THbg904Wf8dMhTAhqXFz6pbJ6P";
    const password = "1aWlZih6Ufv5BS2U";

    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    };

    const data = new URLSearchParams({
        grant_type: "client_credentials"
    });

    try {
        const response = await axios.post(url, data, { headers, auth: { username, password } });
        return response.data.access_token;
    } catch (error) {
        throw new Error(`Request failed: ${error.message}`);
    }
};

// Route to handle data submission to OpenText API
server.post('/post-data', async (req, res) => {
    const url = "https://css.us.api.opentext.com/v2/content";
    const payload = req.body;

    try {
        const accessToken = await getBearerToken();
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        };

        const response = await axios.post(url, payload, { headers });
        res.json({
            status_code: response.status,
            response: response.data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper function to calculate total MFEmissions for each user
const calculateUserEmissions = async () => {
    const devicesCollection = collection(db, 'devices');
    const snapshot = await getDocs(devicesCollection);
    const userEmissions = {};

    snapshot.forEach(doc => {
        const data = doc.data();
        const username = data.username;
        const emissions = data.MFEmissions || 0;

        if (username) {
            if (!userEmissions[username]) {
                userEmissions[username] = 0;
            }
            userEmissions[username] += emissions;
        }
    });

    // Save total emissions to a JSON file
    const leaderboardPath = path.join(__dirname, 'leaderboard.json');
    fs.writeFileSync(leaderboardPath, JSON.stringify(userEmissions, null, 2));

    // Upload the JSON file to Firebase Firestore
    const leaderboardRef = collection(db, 'leaderboard');
    for (const [username, totalEmissions] of Object.entries(userEmissions)) {
        await setDoc(doc(leaderboardRef, username), {
            username,
            totalEmissions
        });
    }
};

// Route to fetch leaderboard
server.get('/leaderboard', async (req, res) => {
    try {
        // Calculate user emissions and save to file and Firebase
        await calculateUserEmissions();

        // Read leaderboard data from file
        const leaderboardPath = path.join(__dirname, 'leaderboard.json');
        if (fs.existsSync(leaderboardPath)) {
            const data = fs.readFileSync(leaderboardPath, 'utf8');
            const userEmissions = JSON.parse(data);

            // Sort users by total emissions (ascending)
            const sortedUsers = Object.keys(userEmissions).map(username => ({
                username,
                totalEmissions: userEmissions[username]
            })).sort((a, b) => a.totalEmissions - b.totalEmissions);

            res.json(sortedUsers);
        } else {
            res.status(500).json({ error: 'Leaderboard data not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
server.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
