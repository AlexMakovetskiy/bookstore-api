const { validationResult, body } = require('express-validator');

const userService = require('../services/user-service');
// const tokenService = require('../services/token-service');
const ApiError = require('../exceptions/api-error');

class BooksController {
    async signup(request, response, next) {
        try {
            const errors = validationResult(request);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }
            const {name, email, password} = request.body;
            const signupStatus = await userService.module.signup(name, email, password);

            response
                .status(201)
                .json(signupStatus);
        } catch (error) {
            next(error);
        }
    }

    async signin(request, response, next) {
        try {
            const {email, password} = request.body;
            const userData = await userService.module.signin(email, password);
            response.cookie('accesstoken', userData.userToken, {
                maxAge: 360000,
                httpOnly: true,
            });
            response.status(200);
        } catch (error) {
            next(error);
        }
    }

    async getdata(request, response, next) {
        try {
            const userToken = request.cookie.accesstoken;
            const userData = await userService.module.getdata(userToken);

            response.status(200);
            response.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async updateData(request, response, next) {
        try {
            const userData = request.body;
            const userUpdateStatus = await userService.module.updateUserData(userData);

            response
                .status(200)
                .json(userUpdateStatus);
        } catch (error) {
            next(error);
        }
    }
    
    async logout(request, response, next) {
        try {
            const userToken = request.cookie.accesstoken;
            const token = await userService.module.logout(userToken);
            response.clearCookie('accesstoken');
            return response
                .status(200)
                .json(token);
        } catch (error) {
            next(error);
        }
    }

    async subscription(request, response, next) {
        try {
            const { email } = request.body;
            const orderStatus = await userService.module.subscription(email);

            response
                .status(201)
                .json(orderStatus);
        } catch (error) {
            next(error);
        }
    }

    async handleOptions(request, response, next) {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Server,Date,access-control-allow-methods,access-control-allow-origin');
        response.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS,PATCH');
        response.send('data');
    }
}

module.exports = new BooksController();