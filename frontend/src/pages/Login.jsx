import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notification from '../components/Notification';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const showNotification = (type, message) => {
        setNotification({ type, message, id: Date.now() });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (notification) setNotification(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            showNotification('error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', formData);
            
            if (response.data.success) {
                localStorage.setItem('scientistSyncUser', JSON.stringify(response.data.user));
                onLogin(response.data.user);
                showNotification('success', 'Login successful! Redirecting...');
                setTimeout(() => navigate('/'), 1500);
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response?.data?.message) {
                showNotification('error', error.response.data.message);
            } else {
                showNotification('error', 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fillDemoCredentials = () => {
        setFormData({
            email: 'john.smith@university.edu',
            password: 'Password123!'
        });
        showNotification('info', 'Demo credentials filled. Click Login to continue.');
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
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to your ScientistSync account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
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
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full mb-4"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center">
                    <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                        Don't have an account?{' '}
                        <Link to="/signup" className="auth-link">
                            Create Account
                        </Link>
                    </p>
                </div>

                <div className="text-center mt-4">
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={fillDemoCredentials}
                        style={{ fontSize: '13px', padding: '8px 16px' }}
                    >
                        Try Demo Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;