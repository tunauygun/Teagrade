const Joi = require('joi');

module.exports.courseSchema = Joi.object({
    course: Joi.object({
        code: Joi.string().required(),
        name: Joi.string().required(),
        image: Joi.string().required()
    }).required()
})

module.exports.studentSchema = Joi.object({
    student: Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        number: Joi.number().required().min(0)
    }).required()
})