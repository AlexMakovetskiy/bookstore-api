/* eslint-disable prefer-destructuring */
const { validationResult } = require("express-validator");

const userService = require("../services/user-service");
const ApiError = require("../exceptions/api-error");
const CommonDto = require("../dtos/common-dto");
const httpResponseNumbers = require("../helpers/constants");

class BooksController {
	async signup(request, response, next) {
		try {
			const errors = validationResult(request);
			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest("Validation error", errors.array()));
			}
			const { name, email, password } = request.body;
			const signupStatus = await userService.module.signup(name, email, password);

			return response.status(httpResponseNumbers.created).json(signupStatus);
		} catch (error) {
			next(error);
		}
	}

	async signin(request, response, next) {
		try {
			const { email, password } = request.body;
			const userData = await userService.module.signin(email, password);

			const userDataDto = {
				statusCode: 202,
				message: userData.userToken.accessToken,
				description: "User login successfully!",
			};

			const userDataResponse = new CommonDto(userDataDto);

			return response
				.header("Access-Control-Allow-Origin", request.headers.origin)
				.status(httpResponseNumbers.accepted)
				.json(userDataResponse);
		} catch (error) {
			next(error);
		}
	}

	async getdata(request, response, next) {
		try {
			const userToken = request.headers.authorization.split(" ")[1];
			const userData = await userService.module.getdata(userToken);

			response.status(httpResponseNumbers.ok);
			response.json(userData);
		} catch (error) {
			next(error);
		}
	}

	async updateData(request, response, next) {
		try {
			const userData = request.body;
			const userUpdateStatus = await userService.module.updateUserData(userData);

			response.status(httpResponseNumbers.ok).json(userUpdateStatus.updateStatus);
		} catch (error) {
			next(error);
		}
	}

	async logout(request, response, next) {
		try {
			const userToken = request.headers.authorization.split(" ")[1];
			const logoutStatus = await userService.module.logout(userToken);
			return response.status(httpResponseNumbers.ok).json(logoutStatus);
		} catch (error) {
			next(error);
		}
	}

	async subscription(request, response, next) {
		try {
			const { email } = request.body;
			const orderStatus = await userService.module.subscription(email);

			response.status(httpResponseNumbers.created).json(orderStatus);
		} catch (error) {
			next(error);
		}
	}

	async handleOptions(request, response) {
		response.header("Access-Control-Allow-Origin", "http://localhost:3000");
		response.header(
			"Access-Control-Allow-Headers",
			"Content-Type",
			"Content-Length",
			"Server",
			"Date",
			"access-control-allow-methods",
			"access-control-allow-origin",
			"Origin",
			"Cookie",
		);
		response.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS, PATCH");
		response.header("Access-Control-Allow-Credentials", "true");
		response.send("data");
	}
}

module.exports = new BooksController();
