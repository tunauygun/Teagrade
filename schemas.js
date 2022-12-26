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

module.exports.testSchema = Joi.object({
    test: Joi.object({
        name: Joi.string().required(),
        answerKey: Joi.array().required().min(1).max(25)
    }).required()
})