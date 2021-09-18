const router = require("express").Router();

// route api/posts
// desc Test route
// access Public
router.get("/", (req, res) => {
	res.send("Posts Routes");
});

module.exports = router;
