// firebaseConfig.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

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

module.exports = { db };
