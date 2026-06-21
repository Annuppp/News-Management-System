import dotenv from "dotenv";

dotenv.config();

const getEnv = (key) => {
    const value = process.env[key];

    if (!value) {
        throw new Error(`${key} is not declared in the environment variables`);
    }

    return value;
};

const config = {
    MONGO_URI: getEnv("MONGO_URI"),

    ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET"),

    REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET"),

    GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),

    GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),

    GOOGLE_REFRESH_TOKEN: getEnv("GOOGLE_REFRESH_TOKEN"),

    GOOGLE_USER: getEnv("GOOGLE_USER"),
};

export default config;
