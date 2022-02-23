const express = require('express');
const Course = require('../models/course');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateCourse} = require('../middleware');

const router = express.Router();

router.get('/', async (req, res) => {
    const courses = await Course.find({});
    res.render('courses/index', { courses });
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('courses/new');
})

router.post('/', isLoggedIn, validateCourse, catchAsync(async (req, res) => {
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