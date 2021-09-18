const router = require("express").Router();

// route api/auth
// desc Test route
// access Public
router.get("/", (req, res) => {
	res.send("Auth Routes");
});

module.exports = router;
