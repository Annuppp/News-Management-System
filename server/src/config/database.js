import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Connected to database");
    } catch (err) {
        console.error("Error connecting to database:", err.message);
        process.exit(1);
    }
};

export default connectDB;
