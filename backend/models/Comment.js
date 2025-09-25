// Comment Model Schema
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Comment author is required']
    },
    authorName: {
        type: String,
        required: [true, 'Author name is required'],
        trim: true
    },
    researchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Research',
        required: [true, 'Research ID is required']
    },
    // Legacy fields for backward compatibility
    name: {
        type: String,
        trim: true
    },
    text: {
        type: String,
        trim: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    votes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            enum: ['upvote', 'downvote'],
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },
    isHighlighted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
CommentSchema.index({ researchId: 1, createdAt: -1 });
CommentSchema.index({ author: 1 });
CommentSchema.index({ parentComment: 1 });

// Instance method to check if comment is a reply
CommentSchema.methods.isReply = function() {
    return this.parentComment !== null;
};

// Instance method to get comment score
CommentSchema.methods.getScore = function() {
    return this.upvotes - this.downvotes;
};

// Pre-save middleware to handle legacy fields
CommentSchema.pre('save', function(next) {
    // Handle legacy fields
    if (this.text && !this.content) {
        this.content = this.text;
    }
    if (this.name && !this.authorName) {
        this.authorName = this.name;
    }
    
    // Set editedAt when comment is modified
    if (this.isModified('content') && !this.isNew) {
        this.isEdited = true;
        this.editedAt = new Date();
    }
    next();
});

module.exports = mongoose.model("Comment", CommentSchema);