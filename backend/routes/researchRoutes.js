const express = require("express");
const router = express.Router();
const Research = require("../models/Research");

// Get all research (excluding soft deleted)
router.get("/", async (req, res) => {
    try {
        // Only fetch research that is not soft deleted
        const research = await Research.find({ isDeleted: false })
            .populate('author', 'username fullName email')
            .sort({ createdAt: -1 });
        res.json(research);
    } catch (error) {
        console.error('Error fetching research:', error);
        res.status(500).json({ message: "Error fetching research", error: error.message });
    }
});

// Get single research by ID
router.get("/:id", async (req, res) => {
    try {
        const research = await Research.findOne({ 
            _id: req.params.id, 
            isDeleted: false 
        }).populate('author', 'username fullName email');
        
        if (!research) {
            return res.status(404).json({ message: "Research not found" });
        }
        
        res.json(research);
    } catch (error) {
        console.error('Error fetching research:', error);
        res.status(500).json({ message: "Error fetching research", error: error.message });
    }
});

// Add new research
router.post("/", async (req, res) => {
    try {
        const { title, abstract, description, category, keywords, link, author, authorName } = req.body;
        
        // Validation
        if (!title || !abstract || !authorName) {
            return res.status(400).json({ 
                message: "Title, abstract, and author name are required" 
            });
        }

        const newResearch = new Research({ 
            title, 
            abstract, 
            description: description || '',
            category: category || 'Other',
            keywords: keywords || [],
            link: link || '',
            author: author || null,
            authorName 
        });
        
        await newResearch.save();
        res.status(201).json(newResearch);
    } catch (error) {
        console.error('Error creating research:', error);
        res.status(500).json({ message: "Error creating research", error: error.message });
    }
});

// Update research (Edit functionality)
router.put("/:id", async (req, res) => {
    try {
        const researchId = req.params.id;
        const { title, abstract, description, category, keywords, link } = req.body;
        
        // Check if research exists and is not deleted
        const existingResearch = await Research.findOne({ 
            _id: researchId, 
            isDeleted: false 
        });
        
        if (!existingResearch) {
            return res.status(404).json({ message: "Research not found or has been deleted" });
        }
        
        // Update fields
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (abstract !== undefined) updateData.abstract = abstract;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (keywords !== undefined) updateData.keywords = keywords;
        if (link !== undefined) updateData.link = link;
        
        const updatedResearch = await Research.findByIdAndUpdate(
            researchId,
            updateData,
            { new: true, runValidators: true }
        ).populate('author', 'username fullName email');
        
        res.json({
            message: "Research updated successfully",
            research: updatedResearch
        });
    } catch (error) {
        console.error('Error updating research:', error);
        res.status(500).json({ message: "Error updating research", error: error.message });
    }
});

// Soft delete research (Delete functionality - data stays in DB)
router.delete("/:id", async (req, res) => {
    try {
        const researchId = req.params.id;
        const { userId } = req.body; // Optional: track who deleted it
        
        // Check if research exists and is not already deleted
        const existingResearch = await Research.findOne({ 
            _id: researchId, 
            isDeleted: false 
        });
        
        if (!existingResearch) {
            return res.status(404).json({ message: "Research not found or already deleted" });
        }
        
        // Soft delete: mark as deleted but keep in database
        const deletedResearch = await Research.findByIdAndUpdate(
            researchId,
            { 
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: userId || null
            },
            { new: true }
        );
        
        res.json({
            message: "Research deleted successfully (soft delete)",
            research: deletedResearch
        });
    } catch (error) {
        console.error('Error deleting research:', error);
        res.status(500).json({ message: "Error deleting research", error: error.message });
    }
});

// Restore soft deleted research (Admin functionality)
router.patch("/:id/restore", async (req, res) => {
    try {
        const researchId = req.params.id;
        
        const restoredResearch = await Research.findByIdAndUpdate(
            researchId,
            { 
                isDeleted: false,
                deletedAt: null,
                deletedBy: null
            },
            { new: true }
        ).populate('author', 'username fullName email');
        
        if (!restoredResearch) {
            return res.status(404).json({ message: "Research not found" });
        }
        
        res.json({
            message: "Research restored successfully",
            research: restoredResearch
        });
    } catch (error) {
        console.error('Error restoring research:', error);
        res.status(500).json({ message: "Error restoring research", error: error.message });
    }
});

// Vote on research
router.post("/:id/vote", async (req, res) => {
    try {
        const { voteType } = req.body; // 'upvote' or 'downvote'
        const research = await Research.findOne({ 
            _id: req.params.id, 
            isDeleted: false 
        });
        
        if (!research) {
            return res.status(404).json({ message: "Research not found" });
        }
        
        if (voteType === 'upvote') {
            research.upvotes += 1;
        } else if (voteType === 'downvote') {
            research.downvotes += 1;
        }
        
        await research.save();
        res.json(research);
    } catch (error) {
        console.error('Error voting on research:', error);
        res.status(500).json({ message: "Error voting on research", error: error.message });
    }
});

module.exports = router;
