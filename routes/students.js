const express = require('express');
const Course = require('../models/course');
const User = require('../models/user');
const Student = require('../models/student');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateCourse, validateStudent} = require('../middleware');
const {deleteStudent} = require("../utils/delete");

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

router.get('/:studentId/edit', async (req, res) => {
    const student = await Student.findById(req.params.studentId);
    if(!student){
        req.flash('error', 'Cannot find the requested course!');
        return res.redirect('/courses');
    }
    const {id, studentId} = req.params
    // console.log(req.p1arams)
    // console.dir(student._id)
    res.render('students/edit', {student, id, studentId});
})

router.put('/:studentId', validateStudent, async (req, res) => {
    const {id , studentId} = req.params;
    const student = await Student.findByIdAndUpdate(studentId, {...req.body.student})
    req.flash('success', 'Successfully updated student!');
    // res.redirect(`/courses/${id}/students/${studentId}`);
    res.redirect(`/courses/${id}/students/`);
})

router.get('/:studentId', async (req, res) => {
    const student = await Student.findById(req.params.studentId).populate({
        path: 'submissions',
        populate: { path: 'test', model: 'Test'}
    });
    if(!student){
        req.flash('error', 'Cannot find the requested course!');
        return res.redirect(`/courses/${id}/students/`);
    }
    const courseId = req.params.id;
    res.render('students/show', {student, courseId});
})

router.post('/', isLoggedIn, validateStudent, catchAsync(async (req, res) => {
    //res.send(req.body);
    const {firstname, lastname, number} = req.body.student;
    const student = new Student({firstname, lastname, number});
    await student.save();
    const course = await Course.findById(req.params.id)
    course.students.push(student);
    await course.save();
    req.flash('success', `Successfully added ${student.firstname} to the course!`);
    res.redirect(`/courses/${course._id}/students`);
}));

router.delete('/:studentId', async (req, res) => {
    const {id:courseId, studentId} = req.params;
    await deleteStudent(studentId);
    res.redirect(`/courses/${courseId}/students`);
})



module.exports = router;
