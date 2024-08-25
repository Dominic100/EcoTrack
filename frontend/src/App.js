// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CarbonEmissionCalculator from './CarbonEmissionCalculator';
import DeviceDetailsPage from './DeviceDetailsPage';
import DeviceSelectionPage from './DeviceSelectionPage';
import Navbar from './Navbar';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import AddDevicePage from './AddDevicePage'; // Import the new AddDevicePage
import { UserProvider, useUser } from './UserContext';
import DeviceInfo from "./DeviceInfo";
import Visualization from './Visualization';

const AppContent = () => {
    const { username, setUsername } = useUser();

    const handleLogin = (username) => {
        setUsername(username);
    };

    const handleLogout = () => {
        setUsername(null);
    };

    return (
        <>
            <Navbar onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<CarbonEmissionCalculator />} />
                <Route path="/device/:subcategory" element={<DeviceSelectionPage />} />
                <Route path="/device/:subcategory/details" element={<DeviceDetailsPage />} />
                <Route path="/register" element={<Register onLogin={handleLogin} />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-device" element={<AddDevicePage />} />
                <Route path="/device-info/:id" element={<DeviceInfo />} />{/* New route for AddDevicePage */}
                <Route path="/visualization/:id" element={<Visualization />} />
            </Routes>
        </>
    );
};

function App() {
    return (
        <Router>
            <UserProvider>
                <AppContent />
            </UserProvider>
        </Router>
    );
}

export default App;
