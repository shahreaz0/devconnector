const router = require("express").Router();
const Joi = require("joi");

// request body validation schema
const schema = Joi.object({
	name: Joi.string().min(3).max(30).required(),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
		.required(),
	email: Joi.string().email().required(),
});

// route POST api/users
// desc Test route
// access Public
router.post("/", (req, res) => {
	const body = schema.validate(req.body);

	if (body?.error) res.send(body.error);
	res.send(body.value);
});

module.exports = router;
