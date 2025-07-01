const Joi = require("joi");

module.exports = {
    registerValidation: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().valid('admin', 'donatur', 'fundraiser').required(),
    }),
    loginValidation: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
}