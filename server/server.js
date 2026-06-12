import app from "./src/app.js";
import connectDB from "./src/config/database.js";

// database connection
connectDB();

app.get('/api/test', (req,res) => {
    res.json({
        message: "backend is working"
    })
})

app.listen("3000", () => {
    console.log("Server is running at PORT: 3000");
});
