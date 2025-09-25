// Team Member 3: Frontend Developer - Profile Page Component
import React, { useState, useEffect } from "react";
import axios from "axios";
import '../App.css';

const Profile = ({ user }) => {
    const [userResearch, setUserResearch] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalResearch: 0,
        totalViews: 0,
        totalUpvotes: 0,
        totalComments: 0
    });

    // Fetch user's research papers
    useEffect(() => {
        if (user) {
            fetchUserResearch();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchUserResearch = async () => {
        try {
            setLoading(true);
            // Fetch all research and filter by current user
            const response = await axios.get('http://localhost:5001/api/research');
            const allResearch = response.data;
            
            // Filter research by current user
            const userPapers = allResearch.filter(paper => 
                paper.author === user.id || 
                paper.authorName === user.fullName ||
                paper.authorName === user.username
            );
            
            setUserResearch(userPapers);
            
            // Calculate stats
            const totalViews = userPapers.reduce((sum, paper) => sum + (paper.viewCount || 0), 0);
            const totalUpvotes = userPapers.reduce((sum, paper) => sum + (paper.upvotes || 0), 0);
            const totalComments = userPapers.reduce((sum, paper) => sum + (paper.commentCount || 0), 0);
            
            setStats({
                totalResearch: userPapers.length,
                totalViews,
                totalUpvotes,
                totalComments
            });
            
            setError('');
        } catch (error) {
            console.error('Error fetching user research:', error);
            setError('Failed to load your research papers.');
        } finally {
            setLoading(false);
        }
    };

    // Redirect if not logged in
    if (!user) {
        return (
            <div className="profile-page fade-in">
                <div className="card text-center">
                    <h2>Login Required</h2>
                    <p>Please log in to view your profile.</p>
                    <div className="auth-buttons">
                        <a href="/login" className="btn btn-primary">Login</a>
                        <a href="/signup" className="btn btn-outline">Sign Up</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page fade-in">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="card profile-info-card">
                    <div className="profile-main">
                        <div className="profile-avatar">
                            {(user.fullName || user.username).charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-details">
                            <h1 className="profile-name">{user.fullName || user.username}</h1>
                            <p className="profile-username">@{user.username}</p>
                            <p className="profile-affiliation">{user.affiliation || 'Independent Researcher'}</p>
                            <p className="profile-email">{user.email}</p>
                            {user.bio && (
                                <p className="profile-bio">{user.bio}</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Profile Stats */}
                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-number">{stats.totalResearch}</span>
                            <span className="stat-label">Research Papers</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{stats.totalViews}</span>
                            <span className="stat-label">Total Views</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{stats.totalUpvotes}</span>
                            <span className="stat-label">Upvotes</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{stats.totalComments}</span>
                            <span className="stat-label">Comments</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Research Papers Section */}
            <section className="user-research-section">
                <div className="section-header">
                    <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '10px' }}>
                        Your Research Papers
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>
                        Manage and track your published research
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                        <button onClick={fetchUserResearch} className="btn btn-secondary">
                            Try Again
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="loading-section text-center">
                        <div className="spinner"></div>
                        <p style={{ color: 'white', marginTop: '20px' }}>Loading your research...</p>
                    </div>
                ) : (
                    <div className="user-research-container">
                        {userResearch.length > 0 ? (
                            <div className="research-grid">
                                {userResearch.map((paper) => (
                                    <div key={paper._id} className="research-card">
                                        <div className="research-header">
                                            <h3 className="research-title">{paper.title}</h3>
                                            <span className="research-category">{paper.category}</span>
                                        </div>
                                        
                                        <p className="research-abstract">
                                            {paper.abstract?.substring(0, 150)}
                                            {paper.abstract?.length > 150 && '...'}
                                        </p>
                                        
                                        <div className="research-meta">
                                            <div className="research-stats">
                                                <span className="stat-item">
                                                    👁️ {paper.viewCount || 0} views
                                                </span>
                                                <span className="stat-item">
                                                    👍 {paper.upvotes || 0} upvotes
                                                </span>
                                                <span className="stat-item">
                                                    💬 {paper.commentCount || 0} comments
                                                </span>
                                            </div>
                                            <div className="research-date">
                                                {new Date(paper.datePublished || paper.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        
                                        {paper.keywords && paper.keywords.length > 0 && (
                                            <div className="research-keywords">
                                                {paper.keywords.slice(0, 3).map((keyword, index) => (
                                                    <span key={index} className="keyword-tag">
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {paper.link && (
                                            <div className="research-actions">
                                                <a 
                                                    href={paper.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline btn-small"
                                                >
                                                    View Paper
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card text-center">
                                <h3>No Research Papers Yet</h3>
                                <p>You haven't published any research papers yet. Start sharing your work with the community!</p>
                                <a href="/upload" className="btn btn-primary">
                                    Upload Your First Paper
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </section>

            <style jsx>{`
                .profile-page {
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .profile-header {
                    margin-bottom: 40px;
                }

                .profile-info-card {
                    padding: 30px;
                }

                .profile-main {
                    display: flex;
                    align-items: center;
                    gap: 25px;
                    margin-bottom: 30px;
                }

                .profile-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 2rem;
                    font-weight: bold;
                    flex-shrink: 0;
                }

                .profile-details {
                    flex: 1;
                }

                .profile-name {
                    font-size: 2rem;
                    margin-bottom: 5px;
                    color: #333;
                }

                .profile-username {
                    color: #667eea;
                    font-weight: 600;
                    margin-bottom: 5px;
                }

                .profile-affiliation {
                    color: #666;
                    margin-bottom: 5px;
                }

                .profile-email {
                    color: #888;
                    font-size: 0.9rem;
                    margin-bottom: 10px;
                }

                .profile-bio {
                    color: #555;
                    font-style: italic;
                }

                .profile-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 20px;
                    padding-top: 25px;
                    border-top: 1px solid #eee;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-number {
                    display: block;
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: #667eea;
                    margin-bottom: 5px;
                }

                .stat-label {
                    font-size: 0.9rem;
                    color: #666;
                }

                .research-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 25px;
                }

                .research-header {
                    display: flex;
                    justify-content: between;
                    align-items: flex-start;
                    margin-bottom: 15px;
                    gap: 15px;
                }

                .research-category {
                    background: rgba(102, 126, 234, 0.1);
                    color: #667eea;
                    padding: 4px 12px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    white-space: nowrap;
                }

                .research-keywords {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin: 15px 0;
                }

                .keyword-tag {
                    background: rgba(118, 75, 162, 0.1);
                    color: #764ba2;
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 500;
                }

                .research-actions {
                    margin-top: 15px;
                }

                .btn-small {
                    padding: 8px 16px;
                    font-size: 0.9rem;
                }

                .auth-buttons {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-top: 20px;
                }

                @media (max-width: 768px) {
                    .profile-main {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    .profile-stats {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .research-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .research-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }
            `}</style>
        </div>
    );
};

export default Profile;
