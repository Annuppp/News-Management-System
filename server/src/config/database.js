import mongoose from "mongoose";
import config from "./config.js";

const connectDB = () => {
    try {
        mongoose.connect(config.MONGO_URI);
        console.log("Connected to database");
    } catch (err) {
        console.log("Error connecting to database.");
        process.exit(1);
    }
};

export default connectDB;
