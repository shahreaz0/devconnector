const router = require("express").Router();

// models
const Profile = require("../models/Profile");
const User = require("../models/User");

// middleware
const auth = require("../middlewares/auth");

// configs
const { userProfileSchema } = require("../configs/validation");

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

// route 	POST api/profile/
// desc 	Create and update profile
// access 	Private
router.post("/", auth, async (req, res) => {
	const { error, value } = userProfileSchema.validate(req.body);
	if (error) return res.status(400).send(error);

	const {
		company,
		website,
		location,
		status,
		skills,
		bio,
		githubusername,
		facebook,
		youtube,
		linkedin,
		instagram,
		twitter,
	} = value;

	const profileFields = {};

	profileFields.user = req.user.id;
	profileFields.status = status;
	profileFields.skills = skills.split(",").map((skill) => skill.trim());

	if (company) profileFields.company = company;
	if (website) profileFields.website = website;
	if (location) profileFields.location = location;
	if (bio) profileFields.bio = bio;
	if (githubusername) profileFields.githubusername = githubusername;

	// social media link builder
	profileFields.social = {};
	if (facebook) profileFields.social.facebook = facebook;
	if (youtube) profileFields.social.youtube = youtube;
	if (instagram) profileFields.social.instagram = instagram;
	if (twitter) profileFields.social.twitter = twitter;

	try {
		let profile = await Profile.findOne({ user: req.user.id });

		if (profile) {
			// Update
			profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				profileFields,
				{ new: true }
			);
			return res.send(profile);
		}

		// create
		profile = new Profile(profileFields);

		await profile.save();

		res.send(profile);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

// route 	GET api/profile/
// desc 	Get all user profiles
// access 	Public
router.get("/", async (req, res) => {
	try {
		const profiles = await Profile.find().populate("user", [
			"name",
			"avatar",
		]);

		res.send(profiles);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

// route 	GET api/profile/:id
// desc 	Get user profile by id
// access 	Public
router.get("/user/:id", async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.params.id }).populate(
			"user",
			["name", "avatar"]
		);

		if (!profile) {
			return res.status(404).send({ message: "No profile found" });
		}

		res.send(profile);
	} catch (error) {
		console.log(error.kind);
		if (error.kind === "ObjectId") {
			return res.status(404).send({ message: "No profile found" });
		}
		res.status(500).send("Server error");
	}
});

// route 	DELETE api/profile/
// desc 	Deelete profile, user and posts
// access 	Private
router.delete("/", auth, async (req, res) => {
	try {
		await Profile.findOneAndRemove({ user: req.user.id });
		await User.findOneAndRemove({ _id: req.user.id });
		// todo => have to delete all the posts associated with it
		res.send({ message: "Successfully deleted" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

module.exports = router;
