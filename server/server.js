import app from "./src/app.js";
import connectDB from "./src/config/database.js";

// database connection
connectDB();

app.get("/api/test", (req, res) => {
    res.json({
        message: "backend is working",
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`);
});
