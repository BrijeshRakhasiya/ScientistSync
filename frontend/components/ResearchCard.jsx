import React, { useState } from "react";
import axios from "axios";
import CommentSection from "./CommentSection";
import Notification from "./Notification";
import { voteResearch } from "../services/api";

const ResearchCard = ({ research, user, onUpdate }) => {
    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [upvoted, setUpvoted] = useState(false);
    const [downvoted, setDownvoted] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const showNotification = (type, message) => {
        setNotification({ type, message, id: Date.now() });
        setTimeout(() => setNotification(null), 4000);
    };

    // Local state for vote counts to update UI immediately
    const [currentUpvotes, setCurrentUpvotes] = useState(research?.upvotes || 0);
    const [currentDownvotes, setCurrentDownvotes] = useState(research?.downvotes || 0);
    
    // Vote handlers
    const handleVote = async (voteType) => {
        if (!user) {
            showNotification('error', 'Please log in to vote');
            return;
        }
        
        try {
            const response = await voteResearch(_id, voteType, user.id);
            
            // Update local state with new counts
            setCurrentUpvotes(response.data.upvotes);
            setCurrentDownvotes(response.data.downvotes);
            
            // Update vote status based on server response
            const userVote = response.data.userVote;
            setUpvoted(userVote === 'upvote');
            setDownvoted(userVote === 'downvote');
            
            // Show appropriate message
            if (userVote) {
                showNotification('success', `${userVote === 'upvote' ? 'Upvoted' : 'Downvoted'} successfully!`);
            } else {
                showNotification('success', 'Vote removed successfully!');
            }
            
            // Call onUpdate if provided to refresh the parent component
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error(`Error ${voteType}ing:`, error);
            showNotification('error', `Failed to ${voteType}. Please try again.`);
        }
    };
    
    const handleUpvote = () => handleVote('upvote');
    const handleDownvote = () => handleVote('downvote');
    
    const [editData, setEditData] = useState({
        title: research?.title || '',
        abstract: research?.abstract || '',
        description: research?.description || '',
        link: research?.link || '',
        category: research?.category || 'Other'
    });
    
    const {
        _id = '',
        title = 'Untitled Research',
        abstract = 'No abstract available',
        description = '',
        authorName = 'Unknown Author',
        author = null,
        category = 'Other',
        keywords = [],
        datePublished = new Date(),
        createdAt = new Date(),
        upvotes = 0,
        downvotes = 0,
        viewCount = 0,
        commentCount = 0,
        link = ''
    } = research || {};

    const isAuthor = user && (
        (typeof author === 'object' && author?._id === user._id) ||
        (typeof author === 'string' && author === user._id) ||
        authorName === user.fullName ||
        authorName === user.username
    );

    const formatDate = (date) => {
        try {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Date unavailable';
        }
    };

    return (
        <div className="research-card">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="research-card-header">
                <h2 className="research-title">{title}</h2>
                
                <div className="research-authors">
                    <div className="author-info">
                        <div className="author-avatar">
                            {authorName.split(' ').map(name => name[0]).join('').slice(0, 2)}
                        </div>
                        <div className="author-details">
                            <p className="author-name">{authorName}</p>
                            <p className="author-affiliation">
                                {author?.affiliation || 'Independent Researcher'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="research-category">
                        <span className="metadata-icon">●</span>
                        {category}
                    </div>
                </div>

                <div className="research-metadata">
                    <div className="metadata-item">
                        <span className="metadata-icon">Published</span>
                        <span>{formatDate(datePublished || createdAt)}</span>
                    </div>
                    <div className="metadata-item">
                        <span className="metadata-icon">Views</span>
                        <span>{viewCount}</span>
                    </div>
                    <div className="metadata-item">
                        <span className="metadata-icon">Comments</span>
                        <span>{commentCount}</span>
                    </div>
                </div>
            </div>

            <div className="research-content">
                <p className="research-abstract">{abstract}</p>
                
                {description && (
                    <div className="research-description">
                        <span className="research-description-label">Methodology & Results:</span>
                        <p className="research-description-text">{description}</p>
                    </div>
                )}

                {keywords && keywords.length > 0 && (
                    <div className="research-keywords">
                        <span className="keywords-label">Keywords:</span>
                        <div className="keywords-list">
                            {keywords.map((keyword, index) => (
                                <span key={index} className="keyword-tag">
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="research-actions">
                <div className="research-stats">
                    <button 
                        className={`stat-item vote-button ${upvoted ? 'voted' : ''}`}
                        onClick={handleUpvote}
                        disabled={!user}
                        title={!user ? 'Login to vote' : 'Upvote this research'}
                    >
                        <span className="stat-icon">▲</span>
                        <span>{currentUpvotes} upvotes</span>
                    </button>
                    
                    <button 
                        className={`stat-item vote-button ${downvoted ? 'voted' : ''}`}
                        onClick={handleDownvote}
                        disabled={!user}
                        title={!user ? 'Login to vote' : 'Downvote this research'}
                    >
                        <span className="stat-icon">▼</span>
                        <span>{currentDownvotes || 0} downvotes</span>
                    </button>
                    
                    <div className="stat-item">
                        <span className="stat-icon">◉</span>
                        <span>{viewCount} views</span>
                    </div>
                </div>

                <div className="research-buttons">
                    {link && (
                        <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="research-link-btn"
                        >
                            <span>→</span>
                            View Full Paper
                        </a>
                    )}
                    
                    <button 
                        onClick={() => setShowComments(!showComments)}
                        className="research-btn research-btn-secondary"
                    >
                        <span>↔</span>
                        {showComments ? 'Hide Comments' : 'Show Comments'}
                    </button>
                </div>
            </div>

            {showComments && (
                <div style={{ borderTop: '1px solid #e5e7eb' }}>
                    <CommentSection researchId={_id} user={user} />
                </div>
            )}
        </div>
    );
};

export default ResearchCard;
