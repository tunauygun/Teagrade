const express = require('express');
const Course = require('../models/course');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { courseSchema } = require('../schemas');

const router = express.Router();

const validateCourse = (req, res, next) => {
    const { error } = courseSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', async (req, res) => {
    const courses = await Course.find({});
    res.render('courses/index', { courses });
})

router.get('/new', (req, res) => {
    res.render('courses/new');
})

router.post('/', validateCourse, catchAsync(async (req, res) => {
    const course = new Course(req.body.course);
    await course.save();
    req.flash('success', 'Successfully created a new course!');
    res.redirect(`/courses/${course._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if(!course){
        req.flash('error', 'Cannot find the requested course!');
        return res.redirect('/courses');
    }
    res.render('courses/show', { course });
}))

router.get('/:id/edit', async (req, res) => {
    const course = await Course.findById(req.params.id);
    if(!course){
        req.flash('error', 'Cannot find the requested course!');
        return res.redirect('/courses');
    }
    res.render('courses/edit', { course });
})

router.put('/:id', validateCourse, async (req, res) => {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, { ...req.body.course })
    req.flash('success', 'Successfully updated course!');
    res.redirect(`/courses/${course._id}`);

})

module.exports = router;