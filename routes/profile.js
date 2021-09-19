const router = require("express").Router();

// models
const Profile = require("../models/Profile");

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
// desc 	Create profile
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

module.exports = router;
