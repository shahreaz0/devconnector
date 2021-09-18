const express = require("express");
const connectDB = require("./configs/db");

// environment variables
if (process.env.NODE_ENV !== "production") require("dotenv").config();

// database connection
connectDB();

// express config
const app = express();

// routes
app.get("/", (req, res) => {
	res.send("API is up and running.");
});
app.use("/api/posts", require("./routes/posts"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

// server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`http://locahost:${PORT}`));
