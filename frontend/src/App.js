import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './About'; // Import the About component
import CarbonEmissionCalculator from './CarbonEmissionCalculator';
import ReducePage from './ReducePage'; // Import the ReducePage component
import DeviceDetailsPage from './DeviceDetailsPage';
import DeviceSelectionPage from './DeviceSelectionPage';
import Navbar from './Navbar';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import AddDevicePage from './AddDevicePage';
import DeviceInfo from './DeviceInfo';
import Visualization from './Visualization';
import Leaderboard from './Leaderboard'; // Import the Leaderboard component
import { UserProvider, useUser } from './UserContext';

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
                <Route path="/" element={<About />} />
                <Route path="/track-carbon-emissions" element={<CarbonEmissionCalculator />} />
                <Route path="/reduce-carbon-footprint" element={<ReducePage />} />
                <Route path="/device/:subcategory" element={<DeviceSelectionPage />} />
                <Route path="/device/:subcategory/details" element={<DeviceDetailsPage />} />
                <Route path="/register" element={<Register onLogin={handleLogin} />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-device" element={<AddDevicePage />} />
                <Route path="/device-info/:id" element={<DeviceInfo />} />
                <Route path="/visualization/:id" element={<Visualization />} />
                <Route path="/leaderboard" element={<Leaderboard />} /> {/* Route for Leaderboard */}
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
