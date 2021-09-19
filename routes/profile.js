const router = require("express").Router();

// models
const Profile = require("../models/Profile");

// middleware
const auth = require("../middlewares/auth");

// route 	GET api/profile/me
// desc 	Get current user
// access 	Private
router.get("/me", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			"user",
			["name", "avatar"]
		);

		if (!profile) {
			return res
				.status(400)
				.send({ message: "There is no profile for this user" });
		}

		res.send(profile);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error.");
	}
});

module.exports = router;
