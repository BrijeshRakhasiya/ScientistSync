// ScientistSync Backend Server
// Team Member 1: Backend Developer - Express server setup and authentication routes
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("🚀 ScientistSync MongoDB connected successfully!"))
.catch((err) => console.log("❌ MongoDB connection error:", err));

// Models
const Research = require("./models/Research");
const Comment = require("./models/Comment");
const User = require("./models/User");

// Default route for testing
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'ScientistSync API',
        message: 'Backend server running successfully!',
        endpoints: [
            '/api/auth/signup - POST',
            '/api/auth/login - POST', 
            '/api/research - GET/POST',
            '/api/comments - GET/POST'
        ]
    });
});

// Authentication Routes (Member 1)
// Signup route with enhanced validation
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password, fullName, affiliation } = req.body;
        
        // Enhanced validation for all required fields
        const errors = [];
        
        if (!username) errors.push('Username is required');
        if (!email) errors.push('Email is required');
        if (!password) errors.push('Password is required');
        if (!fullName) errors.push('Full name is required');
        
        // Username validation
        if (username && username.length < 3) {
            errors.push('Username must be at least 3 characters');
        }
        
        // Email validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (email && !emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
        }
        
        // Password strength validation
        if (password) {
            if (password.length < 8) {
                errors.push('Password must be at least 8 characters long');
            }
            
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasSpecialChar = /[@#$%^&*!?]/.test(password);
            
            if (!hasUpperCase) errors.push('Password must contain at least 1 uppercase letter');
            if (!hasLowerCase) errors.push('Password must contain at least 1 lowercase letter');
            if (!hasNumbers) errors.push('Password must contain at least 1 number');
            if (!hasSpecialChar) errors.push('Password must contain at least 1 special character (@#$%^&*!?)');
        }
        
        if (errors.length > 0) {
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: errors 
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists with this email or username' 
            });
        }
        
        // Create new user (storing plain password as requested)
        const newUser = new User({
            username,
            email,
            password, // Plain text as requested (in real projects, use bcrypt)
            fullName,
            affiliation: affiliation || 'Independent Researcher'
        });
        
        await newUser.save();
        
        // Return user data (excluding password)
        const userResponse = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            fullName: newUser.fullName,
            affiliation: newUser.affiliation,
            joinDate: newUser.joinDate
        };
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: userResponse
        });
        
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        // Check password (plain text comparison as requested)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        // Return user data (excluding password)
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            affiliation: user.affiliation,
            joinDate: user.joinDate
        };
        
        res.json({
            success: true,
            message: 'Login successful',
            user: userResponse
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Research Routes (Member 1)
app.get("/api/research", async (req, res) => {
  try {
    const research = await Research.find().populate('author', 'username fullName affiliation').sort({ datePublished: -1 });
    res.json(research);
  } catch (error) {
    console.error('Error fetching research:', error);
    res.status(500).json({ message: 'Error fetching research papers' });
  }
});

app.post("/api/research", async (req, res) => {
  try {
    const newResearch = new Research(req.body);
    await newResearch.save();
    const populatedResearch = await Research.findById(newResearch._id).populate('author', 'username fullName affiliation');
    res.status(201).json(populatedResearch);
  } catch (error) {
    console.error('Error creating research:', error);
    res.status(500).json({ message: 'Error creating research paper' });
  }
});

// Vote on research
app.post("/api/research/:id/vote", async (req, res) => {
  try {
    const { voteType, userId } = req.body; // 'upvote' or 'downvote', and userId
    const research = await Research.findById(req.params.id);
    
    if (!research) {
      return res.status(404).json({ message: "Research not found" });
    }
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type. Use 'upvote' or 'downvote'" });
    }
    
    // Find existing vote by this user
    const existingVoteIndex = research.votes.findIndex(
      vote => vote.user.toString() === userId.toString()
    );
    
    if (existingVoteIndex !== -1) {
      const existingVote = research.votes[existingVoteIndex];
      
      if (existingVote.type === voteType) {
        // Same vote type - remove vote (toggle off)
        research.votes.splice(existingVoteIndex, 1);
      } else {
        // Different vote type - switch vote
        research.votes[existingVoteIndex].type = voteType;
        research.votes[existingVoteIndex].createdAt = new Date();
      }
    } else {
      // No existing vote - add new vote
      research.votes.push({
        user: userId,
        type: voteType,
        createdAt: new Date()
      });
    }
    
    // Recalculate vote counts
    research.upvotes = research.votes.filter(vote => vote.type === 'upvote').length;
    research.downvotes = research.votes.filter(vote => vote.type === 'downvote').length;
    
    await research.save();
    const populatedResearch = await Research.findById(research._id).populate('author', 'username fullName affiliation');
    
    // Add user's current vote status to response
    const userVote = research.votes.find(vote => vote.user.toString() === userId.toString());
    populatedResearch._doc.userVote = userVote ? userVote.type : null;
    
    res.json(populatedResearch);
  } catch (error) {
    console.error('Error voting on research:', error);
    res.status(500).json({ message: "Error voting on research", error: error.message });
  }
});

// Comment Routes (Member 1)
app.get("/api/comments/:researchId", async (req, res) => {
  try {
    const comments = await Comment.find({ researchId: req.params.researchId })
      .populate('author', 'username fullName')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

app.post("/api/comments", async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();
    const populatedComment = await Comment.findById(newComment._id).populate('author', 'username fullName');
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment' });
  }
});

// Vote on comment
app.post("/api/comments/:id/vote", async (req, res) => {
  try {
    const { voteType, userId } = req.body; // 'upvote' or 'downvote', and userId
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type. Use 'upvote' or 'downvote'" });
    }
    
    // Find existing vote by this user
    const existingVoteIndex = comment.votes.findIndex(
      vote => vote.user.toString() === userId.toString()
    );
    
    if (existingVoteIndex !== -1) {
      const existingVote = comment.votes[existingVoteIndex];
      
      if (existingVote.type === voteType) {
        // Same vote type - remove vote (toggle off)
        comment.votes.splice(existingVoteIndex, 1);
      } else {
        // Different vote type - switch vote
        comment.votes[existingVoteIndex].type = voteType;
        comment.votes[existingVoteIndex].createdAt = new Date();
      }
    } else {
      // No existing vote - add new vote
      comment.votes.push({
        user: userId,
        type: voteType,
        createdAt: new Date()
      });
    }
    
    // Recalculate vote counts
    comment.upvotes = comment.votes.filter(vote => vote.type === 'upvote').length;
    comment.downvotes = comment.votes.filter(vote => vote.type === 'downvote').length;
    
    await comment.save();
    const populatedComment = await Comment.findById(comment._id).populate('author', 'username fullName');
    
    // Add user's current vote status to response
    const userVote = comment.votes.find(vote => vote.user.toString() === userId.toString());
    populatedComment._doc.userVote = userVote ? userVote.type : null;
    
    res.json(populatedComment);
  } catch (error) {
    console.error('Error voting on comment:', error);
    res.status(500).json({ message: "Error voting on comment", error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 ScientistSync server running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`🔗 Frontend: http://localhost:3000`);
});
