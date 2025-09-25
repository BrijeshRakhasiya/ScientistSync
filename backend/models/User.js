//  User Model Schema
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        validate: {
            validator: function(password) {
                // Password must contain:
                // - At least 1 uppercase letter
                // - At least 1 lowercase letter  
                // - At least 1 number
                // - At least 1 special character (@#$%^&*!?)
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!?])[A-Za-z\d@#$%^&*!?]{8,}$/;
                return passwordRegex.test(password);
            },
            message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@#$%^&*!?)'
        }
        // Note: In production, passwords should be hashed using bcrypt
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    affiliation: {
        type: String,
        default: 'Independent Researcher',
        trim: true,
        maxlength: [200, 'Affiliation cannot exceed 200 characters']
    },
    bio: {
        type: String,
        default: '',
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    researchInterests: [{
        type: String,
        trim: true
    }],
    joinDate: {
        type: Date,
        default: Date.now
    },
    profilePicture: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    researchCount: {
        type: Number,
        default: 0
    },
    citationCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Instance method to get public profile data
userSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        username: this.username,
        fullName: this.fullName,
        affiliation: this.affiliation,
        bio: this.bio,
        researchInterests: this.researchInterests,
        joinDate: this.joinDate,
        profilePicture: this.profilePicture,
        isVerified: this.isVerified,
        researchCount: this.researchCount,
        citationCount: this.citationCount
    };
};

module.exports = mongoose.model("User", userSchema);
