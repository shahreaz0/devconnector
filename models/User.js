const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 50,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			minlength: 6,
		},
		avatar: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
