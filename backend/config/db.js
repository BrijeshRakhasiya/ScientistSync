// Team Member 2: Database Developer - MongoDB Connection Configuration
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log(`🍃 MongoDB Connected Successfully!`);
        console.log(`📍 Database Host: ${conn.connection.host}`);
        console.log(`🗄️ Database Name: ${conn.connection.name}`);
        
        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('✅ Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ Mongoose disconnected from MongoDB');
        });

        // Handle app termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('📴 MongoDB connection closed through app termination');
            process.exit(0);
        });

        return conn;
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        console.error('🔧 Please check your MONGO_URI in .env file');
        console.error('📋 Expected format: mongodb://localhost:27017/database_name');
        process.exit(1);
    }
};

module.exports = connectDB;
