const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		company: String,
		website: String,
		location: String,
		status: {
			type: String,
			required: true,
		},
		skills: {
			type: [String],
			required: true,
		},
		bio: String,
		githubusername: String,
		experience: [
			{
				title: {
					type: String,
					required: true,
				},
				company: {
					type: String,
					required: true,
				},
				location: {
					type: String,
					required: true,
				},
				from: Date,
				to: Date,
				current: {
					type: Boolean,
					default: false,
				},
				description: String,
			},
		],
		education: [
			{
				school: {
					type: String,
					required: true,
				},
				degree: {
					type: String,
					required: true,
				},
				current: {
					type: Boolean,
					required: false,
				},
				fieldofstudy: String,
				from: Date,
				to: Date,
				grade: Date,
				extractivities: String,
				description: String,
			},
		],
		social: {
			facebook: String,
			youtube: String,
			instagram: String,
			linkedin: String,
			twitter: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
