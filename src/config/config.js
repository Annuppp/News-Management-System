import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not declared in the environment variable");
}

const config = {
    MONGO_URI: process.env.MONGO_URI,
};

export default config;
