const { Schema, model } = require("mongoose");

const OrderSchema = new Schema({
	email: { type: String, unique: true, require: true },
	isSubscribe: { type: Boolean, require: true },
});

module.exports = model("Order", OrderSchema);
