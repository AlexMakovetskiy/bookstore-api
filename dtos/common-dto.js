module.exports = class CommonDto {
    statusCode;
    message;
    description;

    constructor(model) {
        this.statusCode = model.statusCode;
        this.message = model.message;
        this.description = model.description;
    }
};