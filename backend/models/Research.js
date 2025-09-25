// Research Model Schema
const mongoose = require("mongoose");

const ResearchSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Research title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    abstract: {
        type: String,
        required: [true, 'Abstract is required'],
        trim: true,
        maxlength: [2000, 'Abstract cannot exceed 2000 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    link: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Link must be a valid URL'
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    authorName: {
        type: String,
        required: [true, 'Author name is required'],
        trim: true
    },
    coAuthors: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        required: [true, 'Research category is required'],
        enum: [
            'Computer Science',
            'Biology',
            'Chemistry', 
            'Physics',
            'Mathematics',
            'Medicine',
            'Engineering',
            'Environmental Science',
            'Psychology',
            'Social Sciences',
            'Other'
        ],
        default: 'Other'
    },
    keywords: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    datePublished: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Draft', 'Under Review', 'Published', 'Rejected'],
        default: 'Published'
    },
    link: {
        type: String,
        default: ''
    },
    fileUrl: {
        type: String,
        default: ''
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
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
    commentCount: {
        type: Number,
        default: 0
    },
    isOpenAccess: {
        type: Boolean,
        default: true
    },
    journal: {
        type: String,
        default: 'ScientistSync Platform'
    },
    // Soft Delete Feature: Research posts can be hidden without permanent deletion
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

// Create indexes for better search performance
ResearchSchema.index({ title: 'text', abstract: 'text', keywords: 'text' });
ResearchSchema.index({ category: 1 });
ResearchSchema.index({ author: 1 });
ResearchSchema.index({ datePublished: -1 });

// Instance method to calculate research score
ResearchSchema.methods.getScore = function() {
    return this.upvotes - this.downvotes + (this.viewCount * 0.1) + (this.commentCount * 2);
};

module.exports = mongoose.model("Research", ResearchSchema);