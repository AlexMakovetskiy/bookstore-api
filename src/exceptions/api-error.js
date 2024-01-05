// import httpResponseNumbers from "../helpers/constants";
const httpResponseNumbers = require("../helpers/constants");

class ApiError extends Error {
	status;
	errors;

	constructor(status, message, errors = []) {
		super(message);
		this.status = status;
		this.errors = errors;
	}

	static UnauthorizedError() {
		return new ApiError(httpResponseNumbers.unauthorized, "User is not authorized");
	}

	static ForbiddenError() {
		return new ApiError(httpResponseNumbers.forbidden, "No access");
	}

	static ConflictError() {
		return new ApiError(httpResponseNumbers.conflict, "Conflict");
	}

	static BadRequest(message, errors = []) {
		return new ApiError(httpResponseNumbers.badRequest, message, errors);
	}
}

exports.module = ApiError;
