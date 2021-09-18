const router = require("express").Router();
const Joi = require("joi");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// models
const User = require("../models/User");

// configs
const { registerSchema } = require("../configs/validation");

// route POST api/users
// desc create user
// access Public
router.post("/", async (req, res) => {
	const { error, value } = registerSchema.validate(req.body);
	if (error) return res.status(400).send(error);

	try {
		// user exist or not
		const { name, email, password } = value;
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({
				details: [{ message: "User already exists" }],
			});
		}

		// gravatar url generate
		const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
		// create user instance
		user = new User({ name, email, avatar, password });
		// hash password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		// save user to the db
		await user.save();

		// generate jwt

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: 360000 },
			(err, token) => {
				if (error) throw error;
				res.json({ token });
			}
		);
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
