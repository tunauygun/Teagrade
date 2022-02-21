const Joi = require('joi');

module.exports.courseSchema = Joi.object({
    course: Joi.object({
        code: Joi.string().required(),
        name: Joi.number().required(),
        image: Joi.string().required()
    }).required()
})