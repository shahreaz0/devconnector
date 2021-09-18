const router = require("express").Router();

// route api/users
// desc Test route
// access Public
router.get("/", (req, res) => {
	res.send("Users Routes");
});

module.exports = router;
