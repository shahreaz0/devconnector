const express = require("express");

// express config
const app = express();

// routes
app.get("", (req, res) => {
	res.send("API is up and running.");
});

// server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`http://locahost:${PORT}`));
