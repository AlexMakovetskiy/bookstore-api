const jwt = require('jsonwebtoken');

const tokenModel = require('../models/token-model'); 

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '60m',
        });

        return { accessToken };
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async removeToken(token) {
        const tokenData = await tokenModel.deleteOne({token});
        return tokenData;
    }

    async saveToken(userId, accessToken) {
        const tokenData = await tokenModel.findOne({user: userId});
        if(tokenData) {
            tokenData.accessToken = accessToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({user: userId, accessToken});
        return token;
    }
}

exports.module = new TokenService();