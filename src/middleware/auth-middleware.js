/* eslint-disable prefer-destructuring */
const ApiError = require("../exceptions/api-error");
const tokenService = require("../services/token-service");

// eslint-disable-next-line consistent-return
module.exports = function (request, response, next) {
	try {
		const authorizationHeader = request.headers.authorization;
		if (!authorizationHeader) return next(ApiError.UnauthorizedError());

		const userToken = authorizationHeader.split(" ")[1];
		if (!userToken) return next(ApiError.UnauthorizedError());

		const userData = tokenService.module.validateAccessToken(userToken);
		if (!userData) return next(ApiError.UnauthorizedError());

		request.user = userData;
		next();
	} catch (error) {
		return next(ApiError.UnauthorizedError());
	}
};
