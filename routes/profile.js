const router = require("express").Router();
const axios = require("axios").default;

// models
const Profile = require("../models/Profile");
const User = require("../models/User");

// middleware
const auth = require("../middlewares/auth");

// configs
const {
	userProfileSchema,
	experienceSchema,
	educationSchema,
	updateEducationSchema,
} = require("../configs/validation");

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

// route 	PUT api/profile/experience
// desc 	Update experience
// access 	Private
router.put("/experience", auth, async (req, res) => {
	const { error, value } = experienceSchema.validate(req.body);
	if (error) return res.send(error);
	const { title, company, location, from, to, current, description } = value;

	console.log(value);
	const experienceFields = {};

	experienceFields.title = title;
	experienceFields.company = company;
	if (location) experienceFields.location = location;
	if (from) experienceFields.from = from;
	if (to) experienceFields.to = to;

	if (current) experienceFields.current = current;
	else experienceFields.current = current;

	if (description) experienceFields.description = description;

	// res.send(experienceFields);

	try {
		const profile = await Profile.findOne({ user: req.user.id });
		profile.experience.unshift(experienceFields);
		await profile.save();
		res.send(profile);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

// route 	PUT api/profile/experience/:id
// desc 	Update individual experience
// access 	Private
router.put("/experience/:id", auth, async (req, res) => {
	const { error, value } = experienceSchema.validate(req.body);
	if (error) return res.send(error);
	const { title, company, location, from, to, current, description } = value;

	const experienceFields = {};

	experienceFields.title = title;
	experienceFields.company = company;
	if (location) experienceFields.location = location;
	if (from) experienceFields.from = from;
	if (to) experienceFields.to = to;

	if (current) experienceFields.current = current;
	else experienceFields.current = current;

	if (description) experienceFields.description = description;

	try {
		const profile = await Profile.findOne({ user: req.user.id });

		profile.experience = profile.experience.map((exp) => {
			if (exp._id.equals(req.params.id)) return experienceFields;
			else return exp;
		});
		await profile.save();
		res.send(profile);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

// route 	DELETE api/profile/experience/:id
// desc 	Delete individual experience
// access 	Private
router.delete("/experience/:id", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		profile.experience = profile.experience.filter(
			(exp) => !exp._id.equals(req.params.id)
		);
		await profile.save();
		res.send(profile);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

// route 	PUT api/profile/education
// desc 	Update education
// access 	Private
router.put("/education", auth, async (req, res) => {
	const { error, value } = educationSchema.validate(req.body);
	if (error) return res.send(error);
	const {
		school,
		degree,
		current,
		fieldofstudy,
		from,
		to,
		grade,
		extractivities,
		description,
	} = value;

	const educationFields = {};

	educationFields.school = school;
	educationFields.degree = degree;
	if (from) educationFields.from = from;
	if (to) educationFields.to = to;
	if (fieldofstudy) educationFields.fieldofstudy = fieldofstudy;
	if (grade) educationFields.grade = grade;
	if (extractivities) educationFields.extractivities = extractivities;
	if (description) educationFields.description = description;

	if (current) educationFields.current = current;
	else educationFields.current = current;

	try {
		const profile = await Profile.findOne({ user: req.user.id });
		profile.education.unshift(educationFields);
		await profile.save();
		res.send(profile);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

// route 	PUT api/profile/education/:id
// desc 	Update individual education
// access 	Private
router.put("/education/:id", auth, async (req, res) => {
	const { error, value } = updateEducationSchema.validate(req.body);
	if (error) return res.send(error);
	const {
		school,
		degree,
		current,
		fieldofstudy,
		from,
		to,
		grade,
		extractivities,
		description,
	} = value;

	try {
		const profile = await Profile.findOne({ user: req.user.id });

		const currentUserEducation = profile.education.filter((edu) =>
			edu._id.equals(req.params.id)
		);

		let educationFields = {};

		educationFields.school = school || currentUserEducation[0].school;
		educationFields.degree = degree || currentUserEducation[0].degree;
		educationFields.from = from || currentUserEducation.from;
		educationFields.to = to || currentUserEducation[0].to;

		educationFields.fieldofstudy =
			fieldofstudy || currentUserEducation[0].fieldofstudy;

		educationFields.grade = grade || currentUserEducation[0].grade;

		educationFields.extractivities =
			extractivities || currentUserEducation[0].extractivities;

		educationFields.description =
			description || currentUserEducation[0].description;

		if (current) educationFields.current = current;
		else educationFields.current = current;

		profile.education = profile.education.map((edu) => {
			if (edu._id.equals(req.params.id)) return educationFields;
			else return edu;
		});

		await profile.save();
		res.send(profile);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

// route 	DELETE api/profile/education/:id
// desc 	Delete individual education
// access 	Private
router.delete("/education/:id", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		profile.education = profile.education.filter(
			(edu) => !edu._id.equals(req.params.id)
		);
		await profile.save();
		res.send(profile);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

// route 	GET api/profile/github/:username
// desc 	Get user repos from github
// access 	Public

router.get("/github/:username", async (req, res) => {
	try {
		const option = {
			method: "get",
			url: `https://api.github.com/users/${req.params.username}/repos`,
			params: {
				per_page: 5,
				sort: "created:asc",
				client_id: process.env.GH_CLIENT_ID,
				client_secret: process.env.GH_CLIENT_SECRET,
			},
			headers: {
				"user-agent": "node.js",
			},
		};

		const { data } = await axios(option);

		res.send(data);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

module.exports = router;
