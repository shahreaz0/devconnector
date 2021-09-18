const router = require("express").Router();

// route api/profile
// desc Test route
// access Public
router.get("/", (req, res) => {
	res.send("Profile Routes");
});

module.exports = router;
