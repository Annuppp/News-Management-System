import app from "./src/app.js";
import connectDB from "./src/config/database.js";

// database connection
connectDB();

app.listen("3000", () => {
    console.log("Server is running at PORT: 3000");
});
