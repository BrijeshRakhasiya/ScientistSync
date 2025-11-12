// Modern Professional Navbar Component
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('scientistSyncUser');
        onLogout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    🧬 ScientistSync
                </Link>
                
                <ul className="navbar-nav">
                    {/* <li><Link to="/" className="nav-link">Home</Link></li> */}
                    
                    {user ? (
                        <>
                            <li><Link to="/upload" className="nav-link">Upload Research</Link></li>
                            <li><Link to="/profile" className="nav-link">Profile</Link></li>
                            {(user.role === 'admin' || (typeof window !== 'undefined' && sessionStorage.getItem('adminSecret'))) && (
                                <li><Link to="/admin" className="nav-link">Admin</Link></li>
                            )}
                            <li>
                                <span className="nav-user-info">
                                    Welcome, {user.fullName || user.username}!
                                </span>
                            </li>
                            <li>
                                <button 
                                    onClick={handleLogout}
                                    className="btn btn-outline"
                                    style={{ 
                                        fontSize: '14px',
                                        padding: '8px 16px',
                                        margin: '0'
                                    }}
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login" className="nav-link">Login</Link></li>
                            <li><Link to="/signup" className="nav-link">Sign Up</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;