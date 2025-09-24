// Team Member 2: Database Developer - Database Seeding Script
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Research = require("./models/Research");
const Comment = require("./models/Comment");

dotenv.config(); // Load environment variables

// Sample data for seeding
const sampleUsers = [
    {
        username: 'dr_smith',
        email: 'john.smith@university.edu',
        password: 'Password123!',
        fullName: 'Dr. John Smith',
        affiliation: 'MIT Computer Science',
        bio: 'Professor of Computer Science specializing in AI and Machine Learning.',
        researchInterests: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning']
    },
    {
        username: 'researcher_jane',
        email: 'jane.doe@research.org',
        password: 'Password123!',
        fullName: 'Dr. Jane Doe',
        affiliation: 'Stanford Biology Department',
        bio: 'Molecular biologist working on genetic engineering and CRISPR technology.',
        researchInterests: ['Molecular Biology', 'Genetics', 'CRISPR']
    },
    {
        username: 'prof_wilson',
        email: 'wilson@physics.edu',
        password: 'Password123!',
        fullName: 'Prof. Michael Wilson',
        affiliation: 'Harvard Physics Department',
        bio: 'Theoretical physicist studying quantum mechanics and cosmology.',
        researchInterests: ['Quantum Physics', 'Cosmology', 'Theoretical Physics']
    }
];

const sampleResearch = [
    {
        title: 'Advanced Machine Learning Algorithms for Medical Diagnosis',
        abstract: 'This research presents novel machine learning algorithms designed to improve medical diagnosis accuracy. We developed a deep learning framework that analyzes medical imaging data with 95% accuracy.',
        description: 'Our comprehensive study involved training neural networks on large datasets of medical images including X-rays, MRIs, and CT scans. The results show significant improvement over traditional diagnostic methods.',
        category: 'Computer Science',
        keywords: ['machine learning', 'medical diagnosis', 'deep learning', 'neural networks'],
        authorName: 'Dr. John Smith',
        upvotes: 24,
        viewCount: 156,
        commentCount: 8,
        link: 'https://example.com/research/ml-medical-diagnosis'
    },
    {
        title: 'CRISPR Gene Editing: Revolutionary Approaches to Genetic Disorders',
        abstract: 'Our research explores innovative CRISPR-Cas9 applications for treating hereditary diseases. We successfully demonstrated precise gene editing in laboratory models with minimal off-target effects.',
        description: 'This study focuses on developing safer and more effective CRISPR techniques for treating genetic disorders such as sickle cell disease and cystic fibrosis.',
        category: 'Biology',
        keywords: ['crispr', 'gene editing', 'genetics', 'hereditary diseases'],
        authorName: 'Dr. Jane Doe',
        upvotes: 31,
        viewCount: 203,
        commentCount: 12,
        link: 'https://example.com/research/crispr-gene-editing'
    },
    {
        title: 'Quantum Entanglement and Its Applications in Quantum Computing',
        abstract: 'This paper investigates quantum entanglement phenomena and their practical applications in quantum computing systems. We present new theoretical frameworks for quantum information processing.',
        description: 'Our research contributes to the understanding of quantum mechanics and its practical applications in developing next-generation quantum computers.',
        category: 'Physics',
        keywords: ['quantum entanglement', 'quantum computing', 'quantum mechanics', 'information processing'],
        authorName: 'Prof. Michael Wilson',
        upvotes: 18,
        viewCount: 127,
        commentCount: 6,
        link: 'https://example.com/research/quantum-computing'
    }
];

const sampleComments = [
    {
        content: 'Excellent research! The methodology is very sound and the results are impressive. This could revolutionize medical diagnosis.',
        authorName: 'Dr. Jane Doe'
    },
    {
        content: 'This could have significant implications for early disease detection. Have you tested this on pediatric cases?',
        authorName: 'Prof. Michael Wilson'
    },
    {
        content: 'Fascinating work! I would love to collaborate on expanding this to other medical imaging modalities.',
        authorName: 'Dr. John Smith'
    }
];

const seed = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        
        // Connect to database
        await connectDB();

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await User.deleteMany({});
        await Research.deleteMany({});
        await Comment.deleteMany({});

        // Create users
        console.log('👥 Creating sample users...');
        const createdUsers = await User.insertMany(sampleUsers);
        console.log(`✅ Created ${createdUsers.length} users`);

        // Create research papers with user references
        console.log('📚 Creating sample research papers...');
        const researchWithAuthors = sampleResearch.map((research, index) => ({
            ...research,
            author: createdUsers[index]._id
        }));
        
        const createdResearch = await Research.insertMany(researchWithAuthors);
        console.log(`✅ Created ${createdResearch.length} research papers`);

        // Create comments
        console.log('💬 Creating sample comments...');
        const commentsWithRefs = sampleComments.map((comment, index) => ({
            ...comment,
            author: createdUsers[index % createdUsers.length]._id,
            researchId: createdResearch[0]._id // All comments on first research paper
        }));

        const createdComments = await Comment.insertMany(commentsWithRefs);
        console.log(`✅ Created ${createdComments.length} comments`);

        console.log('🎉 Database seeding completed successfully!');
        console.log('🔍 Test Login Credentials:');
        console.log('   Email: john.smith@university.edu | Password: Password123!');
        console.log('   Email: jane.doe@research.org | Password: Password123!');
        console.log('   Email: wilson@physics.edu | Password: Password123!');
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

// Execute seeding
seed();
