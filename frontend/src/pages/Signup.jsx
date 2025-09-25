import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notification from '../components/Notification';

const Signup = ({ onSignup }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        affiliation: ''
    });
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const showNotification = (type, message) => {
        setNotification({ type, message, id: Date.now() });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (notification) setNotification(null);
    };

    const validateForm = () => {
        if (!formData.fullName || !formData.username || !formData.email || 
            !formData.password || !formData.confirmPassword) {
            showNotification('error', 'Please fill in all required fields');
            return false;
        }

        if (formData.password.length < 8) {
            showNotification('error', 'Password must be at least 8 characters long');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            showNotification('error', 'Passwords do not match');
            return false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            showNotification('error', 'Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5001/api/auth/signup', {
                fullName: formData.fullName,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                affiliation: formData.affiliation
            });
            
            if (response.data.success) {
                localStorage.setItem('scientistSyncUser', JSON.stringify(response.data.user));
                onSignup(response.data.user);
                showNotification('success', 'Account created successfully! Redirecting...');
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (error) {
            console.error('Signup error:', error);
            if (error.response?.data?.message) {
                showNotification('error', error.response.data.message);
            } else {
                showNotification('error', 'Signup failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {notification && (
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        onClose={() => setNotification(null)}
                    />
                )}

                <div className="auth-header">
                    <h1 className="auth-title">Join ScientistSync</h1>
                    <p className="auth-subtitle">Create your research collaboration account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName" className="form-label">Full Name *</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className="form-control"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username *</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="affiliation" className="form-label">Institution/Affiliation</label>
                        <input
                            type="text"
                            id="affiliation"
                            name="affiliation"
                            className="form-control"
                            placeholder="Your institution or organization"
                            value={formData.affiliation}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Create a strong password (min 8 characters)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full mb-4"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center">
                    <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;