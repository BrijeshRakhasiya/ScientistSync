// Enhanced Upload Page with Professional White Theme
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Upload = ({ user }) => {
    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        description: '',
        category: 'Computer Science',
        keywords: '',
        link: '',
        coAuthors: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear messages when user starts typing
        if (error) setError('');
        if (success) setSuccess('');
    };

    // Form validation
    const validateForm = () => {
        if (!formData.title.trim()) {
            return { isValid: false, message: 'Research title is required' };
        }
        if (!formData.abstract.trim()) {
            return { isValid: false, message: 'Abstract is required' };
        }
        if (formData.title.length > 200) {
            return { isValid: false, message: 'Title cannot exceed 200 characters' };
        }
        if (formData.abstract.length > 2000) {
            return { isValid: false, message: 'Abstract cannot exceed 2000 characters' };
        }
        if (formData.description.length > 5000) {
            return { isValid: false, message: 'Description cannot exceed 5000 characters' };
        }
        if (formData.link && !/^https?:\/\/.+/.test(formData.link)) {
            return { isValid: false, message: 'Please enter a valid URL (starting with http:// or https://)' };
        }
        return { isValid: true };
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validation = validateForm();
        if (!validation.isValid) {
            setError(validation.message);
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Prepare form data
            const uploadData = {
                title: formData.title.trim(),
                abstract: formData.abstract.trim(),
                description: formData.description.trim(),
                category: formData.category,
                keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
                link: formData.link.trim(),
                coAuthors: formData.coAuthors.split(',').map(a => a.trim()).filter(a => a),
                author: user.id,
                authorName: user.fullName || user.username
            };

            const response = await axios.post('http://localhost:5001/api/research', uploadData);
            
            if (response.status === 201) {
                setSuccess('Research paper uploaded successfully!');
                
                // Reset form
                setFormData({
                    title: '',
                    abstract: '',
                    description: '',
                    category: 'Computer Science',
                    keywords: '',
                    link: '',
                    coAuthors: ''
                });
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (err) {
            console.error('Upload error:', err);
            
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to upload research paper. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Redirect if not logged in
    if (!user) {
        return (
            <div className="upload-container">
                <div className="card text-center" style={{ maxWidth: '500px', margin: '60px auto' }}>
                    <h2 style={{ color: '#333333', marginBottom: '16px' }}>Login Required</h2>
                    <p style={{ color: '#666666', marginBottom: '24px' }}>
                        Please log in to upload research papers.
                    </p>
                    <a href="/login" className="btn btn-primary">
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="upload-container">
            <div className="card" style={{ maxWidth: '800px', margin: '40px auto' }}>
                <div className="text-center" style={{ marginBottom: '32px' }}>
                    <h2 style={{ color: '#333333', marginBottom: '8px' }}>Upload Research Paper</h2>
                    <p style={{ color: '#666666' }}>
                        Share your research with the scientific community
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {/* Title */}
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Research Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter the title of your research paper"
                                maxLength="200"
                                required
                            />
                            <small style={{ color: '#666666', fontSize: '12px' }}>
                                {formData.title.length}/200 characters
                            </small>
                        </div>

                        {/* Category */}
                        <div className="form-group">
                            <label>Research Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-control"
                                required
                            >
                                <option value="Computer Science">Computer Science</option>
                                <option value="Biology">Biology</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Physics">Physics</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Medicine">Medicine</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Environmental Science">Environmental Science</option>
                                <option value="Psychology">Psychology</option>
                                <option value="Social Sciences">Social Sciences</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Keywords */}
                        <div className="form-group">
                            <label>Keywords</label>
                            <input
                                type="text"
                                name="keywords"
                                value={formData.keywords}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="machine learning, AI, neural networks"
                            />
                            <small style={{ color: '#666666', fontSize: '12px' }}>
                                Separate keywords with commas
                            </small>
                        </div>
                    </div>

                    {/* Abstract */}
                    <div className="form-group">
                        <label>Abstract *</label>
                        <textarea
                            name="abstract"
                            value={formData.abstract}
                            onChange={handleChange}
                            className="form-control"
                            rows="6"
                            placeholder="Provide a comprehensive abstract of your research..."
                            maxLength="2000"
                            required
                        />
                        <small style={{ color: '#666666', fontSize: '12px' }}>
                            {formData.abstract.length}/2000 characters
                        </small>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>Detailed Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-control"
                            rows="4"
                            placeholder="Provide additional details about your research methodology, findings, and implications..."
                            maxLength="5000"
                        />
                        <small style={{ color: '#666666', fontSize: '12px' }}>
                            {formData.description.length}/5000 characters (optional)
                        </small>
                    </div>

                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {/* Research Link */}
                        <div className="form-group">
                            <label>Research Paper Link</label>
                            <input
                                type="url"
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="https://example.com/paper.pdf"
                            />
                            <small style={{ color: '#666666', fontSize: '12px' }}>
                                Link to full paper (PDF, DOI, etc.)
                            </small>
                        </div>

                        {/* Co-authors */}
                        <div className="form-group">
                            <label>Co-authors</label>
                            <input
                                type="text"
                                name="coAuthors"
                                value={formData.coAuthors}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Dr. HC Verma, Prof. Abdul Kalam"
                            />
                            <small style={{ color: '#666666', fontSize: '12px' }}>
                                Separate co-authors with commas
                            </small>
                        </div>
                    </div>

                    {/* Author Info Display */}
                    <div style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '24px'
                    }}>
                        <h4 style={{ color: '#333333', marginBottom: '8px' }}>Author Information</h4>
                        <p style={{ color: '#666666', marginBottom: '4px' }}>
                            <strong>Name:</strong> {user.fullName || user.username}
                        </p>
                        <p style={{ color: '#666666', marginBottom: '4px' }}>
                            <strong>Email:</strong> {user.email}
                        </p>
                        {user.affiliation && (
                            <p style={{ color: '#666666' }}>
                                <strong>Affiliation:</strong> {user.affiliation}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ 
                                padding: '16px 32px', 
                                fontSize: '16px',
                                minWidth: '200px'
                            }}
                        >
                            {loading ? 'Uploading...' : 'Upload Research Paper'}
                        </button>
                    </div>

                    {/* Form Footer */}
                    <div style={{ 
                        marginTop: '24px',
                        padding: '16px',
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#856404'
                    }}>
                        <p><strong>Note:</strong> Your research paper will be publicly visible once uploaded. 
                        Make sure all information is accurate before submitting.</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Upload;