const bcrypt = require("bcryptjs");

const UserModel = require("../models/user-model");
const OrderModel = require("../models/order-model");
const tokenModel = require("../models/token-model");
const tokenService = require("../services/token-service");
const mailService = require("./mail-service");
const ApiError = require("../exceptions/api-error");
const CommonDto = require("../dtos/common-dto");
const UserDto = require("../dtos/user-dto");

class userService {
	async signup(name, email, password) {
		const candidate = await UserModel.findOne({ email });
		if (candidate) throw ApiError.BadRequest(`User with email: ${email} already exists!`);
		const hashPassword = await bcrypt.hash(password, process.env.CRYPT_STEPS);

		const user = await UserModel.create({ name, email, password: hashPassword });

		const userDto = new UserDto(user);
		const token = tokenService.module.generateToken({ ...UserDto });
		await tokenService.module.saveToken(userDto.id, token.accessToken);

		const signupResponse = {
			statusCode: 201,
			message: "Created",
			description: "User created successfully!",
		};
		const commonDto = new CommonDto(signupResponse);

		return { signupStatus: commonDto };
	}

	async signin(email, password) {
		const user = await UserModel.findOne({ email });
		if (!user) throw ApiError.UnauthorizedError();

		const isPasswordEquals = await bcrypt.compare(password, user.password);
		if (!isPasswordEquals) throw ApiError.BadRequest("Incorrect password!");

		const userDto = new UserDto(user);
		const token = tokenService.module.generateToken({ ...userDto });

		await tokenService.module.saveToken(userDto.id, token.accessToken);

		return {
			userToken: token,
		};
	}

	async getdata(userToken) {
		const isValidToken = tokenService.module.validateAccessToken(userToken);
		if (!isValidToken) throw ApiError.ForbiddenError();

		const userTokenData = await tokenModel.findOne({ accessToken: userToken });
		if (!userTokenData) throw ApiError.BadRequest();

		const userData = await UserModel.findOne({ _id: userTokenData.user });
		const userDto = new UserDto(userData);

		return {
			user: userDto,
		};
	}

	async updateUserData(userData) {
		const user = await UserModel.findOne({ email: userData.userEmail });
		if (!user) throw ApiError.UnauthorizedError();

		const candidate = await UserModel.findOne({ email: userData.email.trim() });
		if (candidate) throw ApiError.BadRequest(`User with email: ${userData.email} already exists!`);

		const hashPassword =
			!userData.password || userData.password === "password"
				? user.password
				: await bcrypt.hash(userData.password.trim(), process.env.CRYPT_STEPS);
		const userUpdatedInfo = await UserModel.updateOne({
			name: userData.name.trim(),
			email: userData.email.trim(),
			password: hashPassword,
		});
		if (!userUpdatedInfo) throw ApiError.ConflictError();

		const updateResponse = {
			statusCode: 200,
			message: "Update",
			description: "User data updated successfully!",
		};
		return new CommonDto(updateResponse);
	}

	async subscription(email) {
		const candidate = await OrderModel.findOne({ email });
		if (candidate) throw ApiError.BadRequest(`User with email: ${email} already subscribe!`);

		const subscriptionStatus = true;
		await OrderModel.create({ email, isSubscribe: subscriptionStatus });
		await mailService.module.sendSubscriptionMail(email);

		const subscriptionResponse = {
			statusCode: 201,
			message: "Created",
			description: "User subscribed successfully!",
		};
		const commonDto = new CommonDto(subscriptionResponse);

		return { subscriptionStatus: commonDto };
	}

	async logout(userToken) {
		const tokenData = await tokenService.module.removeToken(userToken);
		if (!tokenData) throw ApiError.BadRequest("Error login data!");
		const logoutData = {
			statusCode: 200,
			message: "Reset",
			description: "User signout successfully!",
		};
		return new CommonDto(logoutData);
	}
}

exports.module = new userService();
