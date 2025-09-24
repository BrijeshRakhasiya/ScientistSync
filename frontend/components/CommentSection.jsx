// Team Member 3: Frontend Developer - Comment Section Component
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { voteComment } from '../services/api';
import '../App.css';

const CommentSection = ({ researchId, user, onCommentAdded }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch comments from API
    const fetchComments = useCallback(async () => {
        if (!researchId) return;
        
        try {
            setLoading(true);
            setError('');
            const url = user ? 
                `http://localhost:5001/api/comments/${researchId}?userId=${user.id}` :
                `http://localhost:5001/api/comments/${researchId}`;
            const response = await axios.get(url);
            setComments(response.data || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setError('Failed to load comments');
        } finally {
            setLoading(false);
        }
    }, [researchId, user]);

    // Fetch comments when component mounts or researchId changes
    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // Handle comment submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setError('Please log in to post comments');
            return;
        }

        if (!newComment.trim()) {
            setError('Please enter a comment');
            return;
        }

        if (newComment.trim().length < 5) {
            setError('Comment must be at least 5 characters long');
            return;
        }

        try {
            setSubmitLoading(true);
            setError('');

            const commentData = {
                content: newComment.trim(),
                author: user.id,
                authorName: user.fullName || user.username,
                researchId: researchId
            };

            const response = await axios.post('http://localhost:5001/api/comments', commentData);
            
            if (response.data) {
                // Add new comment to the beginning of the list
                setComments(prevComments => [response.data, ...prevComments]);
                setNewComment('');
                
                // Notify parent component about new comment
                if (onCommentAdded) {
                    onCommentAdded();
                }
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to post comment. Please try again.');
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    // Handle comment voting
    const handleCommentVote = async (commentId, voteType) => {
        if (!user) {
            setError('Please log in to vote on comments');
            return;
        }
        
        try {
            const response = await voteComment(commentId, voteType, user.id);
            
            // Update the comment in the local state with complete data including user vote status
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment._id === commentId
                        ? { ...comment, ...response.data }
                        : comment
                )
            );
        } catch (error) {
            console.error(`Error ${voteType}ing comment:`, error);
            setError(`Failed to ${voteType} comment. Please try again.`);
        }
    };

    // Format date for display
    const formatDate = (date) => {
        try {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Date unavailable';
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        setNewComment(e.target.value);
        if (error) setError('');
    };

    return (
        <div className="comment-section">
            <div className="comment-header">
                <h4>Comments ({comments.length})</h4>
            </div>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="comment-form">
                    <div className="comment-form-header">
                        <div className="commenter-avatar">
                            {(user.fullName || user.username).charAt(0).toUpperCase()}
                        </div>
                        <div className="commenter-info">
                            <strong>{user.fullName || user.username}</strong>
                            <small>@{user.username}</small>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <textarea
                            value={newComment}
                            onChange={handleInputChange}
                            className="comment-textarea"
                            placeholder="Share your thoughts on this research..."
                            rows="3"
                            disabled={submitLoading}
                            maxLength="1000"
                        />
                        <small className="char-count">
                            {newComment.length}/1000 characters
                        </small>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="comment-form-actions">
                        <button 
                            type="button"
                            onClick={() => {
                                setNewComment('');
                                setError('');
                            }}
                            className="btn btn-secondary btn-small"
                            disabled={submitLoading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-small"
                            disabled={submitLoading || !newComment.trim()}
                        >
                            {submitLoading ? (
                                <>
                                    <span className="loading-spinner-tiny"></span>
                                    Posting...
                                </>
                            ) : (
                                'Post Comment'
                            )}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="login-prompt">
                    <p>Please <a href="/login">log in</a> to post comments.</p>
                </div>
            )}

            {/* Comments List */}
            <div className="comments-list">
                {loading ? (
                    <div className="loading-comments">
                        <div className="spinner-small"></div>
                        <p>Loading comments...</p>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="no-comments">
                        <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id || Math.random()} className="comment-item">
                            <div className="comment-header-item">
                                <div className="comment-avatar">
                                    {(comment.authorName || comment.name || 'A').charAt(0).toUpperCase()}
                                </div>
                                <div className="comment-info">
                                    <div className="comment-author">
                                        {comment.authorName || comment.name || 'Anonymous'}
                                    </div>
                                    <div className="comment-date">
                                        {formatDate(comment.createdAt || comment.updatedAt || Date.now())}
                                    </div>
                                </div>
                            </div>
                            <div className="comment-content">
                                {comment.content || comment.text || 'No content'}
                                {comment.isEdited && (
                                    <span className="edited-badge">(edited)</span>
                                )}
                            </div>
                            <div className="comment-actions">
                                <button 
                                    className={`comment-action-btn ${comment.userVote === 'upvote' ? 'voted' : ''}`}
                                    onClick={() => handleCommentVote(comment._id, 'upvote')}
                                    disabled={!user}
                                    title={!user ? 'Login to vote' : 'Upvote comment'}
                                >
                                    ▲ {comment.upvotes || 0}
                                </button>
                                <button 
                                    className={`comment-action-btn ${comment.userVote === 'downvote' ? 'voted' : ''}`}
                                    onClick={() => handleCommentVote(comment._id, 'downvote')}
                                    disabled={!user}
                                    title={!user ? 'Login to vote' : 'Downvote comment'}
                                >
                                    ▼ {comment.downvotes || 0}
                                </button>
                                <button className="comment-action-btn">
                                    Reply
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style jsx>{`
                .comment-section {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 15px;
                    padding: 25px;
                    margin-top: 20px;
                    border: 1px solid rgba(102, 126, 234, 0.1);
                }

                .comment-header h4 {
                    color: #333;
                    margin-bottom: 20px;
                    font-size: 1.2rem;
                }

                .comment-form {
                    background: rgba(102, 126, 234, 0.05);
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 25px;
                }

                .comment-form-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 15px;
                }

                .commenter-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 1rem;
                }

                .commenter-info {
                    flex: 1;
                }

                .commenter-info strong {
                    display: block;
                    color: #333;
                    margin-bottom: 2px;
                }

                .commenter-info small {
                    color: #667eea;
                }

                .comment-textarea {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid rgba(102, 126, 234, 0.2);
                    border-radius: 10px;
                    font-size: 14px;
                    font-family: inherit;
                    resize: vertical;
                    transition: border-color 0.3s ease;
                }

                .comment-textarea:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .char-count {
                    color: #666;
                    font-size: 0.8rem;
                    margin-top: 5px;
                    display: block;
                }

                .comment-form-actions {
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                    margin-top: 15px;
                }

                .login-prompt {
                    background: rgba(102, 126, 234, 0.05);
                    padding: 20px;
                    border-radius: 12px;
                    text-align: center;
                    margin-bottom: 25px;
                }

                .login-prompt a {
                    color: #667eea;
                    font-weight: 600;
                    text-decoration: none;
                }

                .comments-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .loading-comments {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #666;
                    padding: 20px;
                    text-align: center;
                }

                .spinner-small {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #ddd;
                    border-top: 2px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .loading-spinner-tiny {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .no-comments {
                    text-align: center;
                    color: #666;
                    padding: 40px 20px;
                    font-style: italic;
                }

                .comment-item {
                    padding: 20px;
                    border: 1px solid #eee;
                    border-radius: 12px;
                    background: white;
                    transition: all 0.3s ease;
                }

                .comment-item:hover {
                    border-color: rgba(102, 126, 234, 0.3);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }

                .comment-header-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                }

                .comment-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 0.9rem;
                }

                .comment-info {
                    flex: 1;
                }

                .comment-author {
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 2px;
                }

                .comment-date {
                    font-size: 0.8rem;
                    color: #888;
                }

                .comment-content {
                    color: #555;
                    line-height: 1.6;
                    margin-bottom: 15px;
                    padding-left: 48px;
                }

                .edited-badge {
                    color: #888;
                    font-size: 0.8rem;
                    font-style: italic;
                    margin-left: 8px;
                }

                .comment-actions {
                    display: flex;
                    gap: 15px;
                    padding-left: 48px;
                }

                .comment-action-btn {
                    background: none;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.3s ease;
                    padding: 5px 10px;
                    border-radius: 15px;
                }

                .comment-action-btn:hover {
                    color: #667eea;
                    background: rgba(102, 126, 234, 0.1);
                }

                .comment-action-btn.voted {
                    color: #667eea;
                    background: rgba(102, 126, 234, 0.15);
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .comment-form-actions {
                        flex-direction: column;
                    }
                    
                    .comment-content,
                    .comment-actions {
                        padding-left: 0;
                        margin-top: 10px;
                    }
                    
                    .comment-actions {
                        flex-wrap: wrap;
                    }
                }
            `}</style>
        </div>
    );
};

export default CommentSection;
