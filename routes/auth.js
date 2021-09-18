const router = require("express").Router();

// auth middleware
const auth = require("../middlewares/auth");

// route api/auth
// desc Test route
// access Public
router.get("/", auth, (req, res) => {
	res.send("Auth Routes");
});

module.exports = router;
