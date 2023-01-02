const express = require('express');
const Course = require('../models/course');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateCourse, isAuthorized} = require('../middleware');
const {deleteCourse} = require("../utils/delete");

const router = express.Router();

router.get('/', isLoggedIn, async (req, res) => {
    const {courses} = await User.findById(req.user._id).populate('courses');
    //res.send(courses);
    res.render('courses/index', { courses });
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('courses/new');
})

router.post('/', isLoggedIn, validateCourse, catchAsync(async (req, res) => {
    const course = new Course(req.body.course);
    await course.save();
    req.user.courses.push(course);
    await req.user.save();
    req.flash('success', 'Successfully created a new course!');
    res.redirect(`/courses/${course._id}`)
}))

router.get('/:id', isLoggedIn, isAuthorized, catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if(!course){
        req.flash('error', 'Cannot find the requested course!');
        return res.redirect('/courses');
    }
    res.render('courses/show', { course });
}))

router.get('/:id/edit', isLoggedIn, isAuthorized, async (req, res) => {
    const course = await Course.findById(req.params.id);
    if(!course){
        req.flash('error', 'Cannot find the requested course!');
        return res.redirect('/courses');
    }
    res.render('courses/edit', { course });
})

router.put('/:id', isLoggedIn, isAuthorized, validateCourse, async (req, res) => {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, { ...req.body.course })
    req.flash('success', 'Successfully updated course!');
    res.redirect(`/courses/${id}`);

})

router.delete('/:id', isLoggedIn, isAuthorized, async (req, res) => {
    const {id} = req.params;
    await deleteCourse(id);
    res.redirect('/courses');
})



module.exports = router;