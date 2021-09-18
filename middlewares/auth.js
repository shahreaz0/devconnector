const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
	const token = req.header("x-auth-token");

	if (!token) {
		return res
			.status(400)
			.json({ message: "No token, Authentication denied" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded.user;
		next();
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: "Token is not valid" });
	}
};
