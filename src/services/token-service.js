const jwt = require("jsonwebtoken");

const tokenModel = require("../models/token-model");

class TokenService {
	generateToken(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
			expiresIn: "60m",
		});

		return { accessToken };
	}

	validateAccessToken(token) {
		try {
			return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		} catch (error) {
			return null;
		}
	}

	async removeToken(token) {
		return await tokenModel.deleteOne({ token });
	}

	async saveToken(userId, accessToken) {
		const tokenData = await tokenModel.findOne({ user: userId });
		if (tokenData) {
			tokenData.accessToken = accessToken;
			return tokenData.save();
		}
		return await tokenModel.create({ user: userId, accessToken });
	}
}

exports.module = new TokenService();
