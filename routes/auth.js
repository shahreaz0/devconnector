const router = require("express").Router();
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// models
const User = require("../models/User");

// auth middleware
const auth = require("../middlewares/auth");

const schema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
		.min(6)
		.required(),
});

// route api/auth
// desc Test route
// access Public
router.get("/", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.send(user);
	} catch (error) {
		// statements
		console.log(error);
	}
});

router.post("/", async (req, res) => {
	console.log(req.body);
	const { error, value } = schema.validate(req.body);
	if (error) return res.status(400).send(error);

	const { email, password } = value;

	const user = await User.findOne({ email });

	if (!user) {
		return res
			.status(400)
			.send({ details: [{ message: "Invalid email or password" }] });
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		return res
			.status(400)
			.send({ details: [{ message: "Invalid email or password" }] });
	}

	const payload = {
		user: {
			id: user.id,
		},
	};

	jwt.sign(
		payload,
		process.env.JWT_SECRET,
		{ expiresIn: 36000 },
		(error, token) => {
			if (error) throw error.message;
			res.send({ token });
		}
	);
});

module.exports = router;
