import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = ({ onLogout }) => {
    const { username, setUsername } = useUser();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    const handleLogout = () => {
        setUsername(null); // Clear username from context
        onLogout();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" style={{ padding: '4px 15px' }}>
            <div className="container-fluid">
                <Link to="/" className="navbar-brand" style={{ fontSize: '22px' }}>EcoTrack</Link>
                <div className="collapse navbar-collapse justify-content-end">
                    <ul className="navbar-nav">
                        {username ? (
                            <li className="nav-item dropdown">
                                <span
                                    className="nav-link dropdown-toggle"
                                    id="navbarDropdown"
                                    role="button"
                                    onClick={toggleDropdown}
                                    aria-expanded={isDropdownOpen}
                                    style={{ cursor: 'pointer', marginRight: '-10px' }} // Adjusted margin to shift left
                                >
                                    <span
                                        style={{
                                            width: '25px',
                                            height: '25px',
                                            borderRadius: '50%',
                                            backgroundColor: '#444',
                                            color: 'white',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginLeft: '-5px' // Adjusted to shift profile pic left
                                        }}
                                    >
                                        {username.charAt(0).toUpperCase()}
                                    </span>
                                </span>
                                <ul
                                    className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`}
                                    aria-labelledby="navbarDropdown"
                                    style={{ right: 'auto', left: '50%', transform: 'translateX(-50%)' }} // Centered dropdown under the profile pic
                                >
                                    <li>
                                        <Link className="dropdown-item" to="/dashboard">Dashboard</Link>
                                    </li>
                                    <li>
                                        <span className="dropdown-item" onClick={handleLogout}>Logout</span>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/register" className="nav-link">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
