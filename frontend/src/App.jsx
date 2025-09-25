// Team Member 3: Frontend Developer - Main App Component with Authentication
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import './App.css';

const App = () => {
  // User authentication state management
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('scientistSyncUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('scientistSyncUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('scientistSyncUser', JSON.stringify(userData));
  };

  // Logout function
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('scientistSyncUser');
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading ScientistSync...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Navbar user={user} onLogout={logoutUser} />
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={<Home user={user} />} 
            />
            <Route 
              path="/upload" 
              element={<Upload user={user} />} 
            />
            <Route 
              path="/profile" 
              element={<Profile user={user} />} 
            />
            <Route 
              path="/login" 
              element={<Login onLogin={loginUser} />} 
            />
            <Route 
              path="/signup" 
              element={<Signup onSignup={loginUser} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
