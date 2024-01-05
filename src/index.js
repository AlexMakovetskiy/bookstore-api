/* eslint-disable no-console */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const router = require("./routes/books-routes");

const app = express();

const requestsTimePeriod = 240000;
const mockPortNumber = 6000;
const PORT = process.env.PORT || mockPortNumber;

const limiter = rateLimit({
	windowMs: requestsTimePeriod,
	max: 4,
	message: "Превышено максимальное количество запросов, попробуйте позже.",
});

app.use(express.json());
app.use(
	cors({
		credentials: true,
		origin: "http://localhost:3000",
	}),
);
app.use(limiter);
app.use(helmet());
app.use("/api", router);

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'", "'unsafe-inline'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			imgSrc: ["'self'"],
			connectSrc: ["'self'"],
			fontSrc: ["'self'"],
			objectSrc: ["'none'"],
			mediaSrc: ["'self'"],
			frameSrc: ["'self'"],
		},
	}),
);

app.disable("x-powered-by");

const start = async () => {
	try {
		mongoose
			.connect(process.env.BD_URL, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then(() => console.log("Connected to DB"))
			.catch((error) => console.log(`Connection error: ${error}`));
		app.listen(PORT, (error) => {
			error ? console.log(error) : console.log(`Server opened in PORT: ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
