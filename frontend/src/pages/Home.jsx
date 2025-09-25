import React, { useState, useEffect } from 'react';
import ResearchCard from '../components/ResearchCard';

function Home({ user }) {
  const [research, setResearch] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/research');
      if (!response.ok) {
        throw new Error('Failed to fetch research');
      }
      const data = await response.json();
      setResearch(data);
    } catch (err) {
      setError('Failed to load research papers');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Scientific Background Icons */}
        <div className="scientific-icons">
          {/* <div className="floating-icon">🧬</div>
          <div className="floating-icon">⚛️</div>
          <div className="floating-icon">🔬</div>
          <div className="floating-icon">🧪</div>
          <div className="floating-icon">📊</div>
          <div className="floating-icon">🔍</div> */}
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            Accelerating Scientific Discovery
          </div>
          
          <h1 className="hero-title">
            Connect. Collaborate. <span className="text-gradient">Discover.</span>
          </h1>
          
          <p className="hero-subtitle">
            Join the global community of researchers, share groundbreaking discoveries, 
            and accelerate the pace of scientific innovation through seamless collaboration.
          </p>
          
          <div className="hero-features">
            <div className="hero-feature">
              <span className="hero-feature-icon"></span>
              <span>Research Repository</span>
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon"></span>
              <span>Peer Collaboration</span>
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon"></span>
              <span>Innovation Hub</span>
            </div>
          </div>
          
          <a href="/upload" className="hero-cta">
            <span></span>
            Start Research Journey
          </a>
        </div>
      </section>

      {/* Research Section */}
      <section className="research-section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Research Papers</h2>
            <p>Discover cutting-edge research from scientists worldwide</p>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading research papers...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon"></div>
              <h3>Unable to Load Research</h3>
              <p>{error}</p>
              <button onClick={fetchResearch} className="retry-button">
                Try Again
              </button>
            </div>
          ) : research.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <h3>No Research Papers Yet</h3>
              <p>Be the first to share your groundbreaking research with the scientific community!</p>
              <a href="/upload" className="cta-button">
                Upload First Paper
              </a>
            </div>
          ) : (
            <div className="research-grid">
              {research.map((paper) => (
                <ResearchCard key={paper._id} research={paper} user={user} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;