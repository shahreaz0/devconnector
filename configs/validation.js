const Joi = require("joi");

// register user validation
const registerSchema = Joi.object({
	name: Joi.string().min(3).max(30).required(),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
		.min(6)
		.required(),
	email: Joi.string().email().required(),
});

// login user validation
const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
		.min(6)
		.required(),
});

// user profile validation
const userProfileSchema = Joi.object({
	status: Joi.string().required(),
	skills: Joi.required(),
	company: Joi.string(),
	location: Joi.string(),
	bio: Joi.string(),
	website: Joi.string().uri(),
	githubusername: Joi.string(),
	facebook: Joi.string().uri(),
	youtube: Joi.string().uri(),
	instagram: Joi.string().uri(),
	twitter: Joi.string().uri(),
	linkedin: Joi.string().uri(),
});

const experienceSchema = Joi.object({
	title: Joi.string().required(),
	company: Joi.string().required(),
	location: Joi.string(),
	from: Joi.date(),
	to: Joi.date(),
	current: Joi.boolean(),
	description: Joi.string(),
});

module.exports = {
	registerSchema,
	loginSchema,
	userProfileSchema,
	experienceSchema,
};
