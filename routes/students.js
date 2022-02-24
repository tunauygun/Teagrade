const express = require('express');
const Course = require('../models/course');
const User = require('../models/user');
const Student = require('../models/student');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateCourse, validateStudent} = require('../middleware');

const router = express.Router({mergeParams: true});

router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const {students} = await Course.findById(req.params.id).populate('students');
    const courseId = req.params.id;
    res.render('students/index', {students, courseId});
}));

router.get('/new', isLoggedIn, (req, res) => {
    const courseId = req.params.id;
    res.render('students/new', {courseId});
});

router.post('/', isLoggedIn, validateStudent, catchAsync(async (req, res) => {
    //res.send(req.body);
    const {firstname, lastname, number} = req.body.student;
    const student = new Student({firstname, lastname, number});
    await student.save();
    const course = await Course.findById(req.params.id)
    course.students.push(student);
    await course.save();
    req.flash('success', `Successfully added ${student.firstname} to the course!`);
    res.redirect(`/courses/${course._id}/students`)
}));

module.exports = router;
