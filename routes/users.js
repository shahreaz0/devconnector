const router = require("express").Router();
const Joi = require("joi");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// models
const User = require("../models/User");

// request body validation schema
const schema = Joi.object({
	name: Joi.string().min(3).max(30).required(),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
		.min(6)
		.required(),
	email: Joi.string().email().required(),
});

// route POST api/users
// desc create user
// access Public

// function test(cb) {

// }

// console.log(test());

router.post("/", async (req, res) => {
	const { error, value } = schema.validate(req.body);
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
			{ expiresIn: 3600 },
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
