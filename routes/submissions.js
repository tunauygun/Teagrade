const express = require('express');
const Course = require('../models/course');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateTest, validateStudent} = require('../middleware');
const Test = require("../models/test");
const Student = require("../models/student");
const Submission = require("../models/submission");
const {deleteSubmission, deleteTest, deleteStudent, deleteCourse} = require('../utils/delete');

const router = express.Router({mergeParams: true});

// router.get('/',isLoggedIn, catchAsync( async (req, res) => {
//     const {tests} = await Course.findById(req.params.id).populate('tests');
//     const courseId = req.params.id;
//     res.render('tests/index', {courseId, tests});
// }));
//
router.get('/new', isLoggedIn, (req, res) => {
    const {id:courseId, testId} = req.params;
    res.render('submissions/new', {courseId, testId});
});

router.post('/', isLoggedIn, catchAsync(async (req, res) => {
    const {id: courseId, testId} = req.params;
    const {studentNumber, studentAnswers} = req.body.submission;
    const course = await Course.findById(courseId);
    let courseStudents = course.students;
    const student = await Student.findOne({number: studentNumber});
    courseStudents.forEach(function(element, index, array){
        array[index] = element.valueOf();
    });
    if(!student || !course.students.includes(student._id.valueOf())){
        req.flash('error', 'This course does not have a student with the given id!');
        return res.redirect(`/courses/${courseId}/tests/${testId}/submissions/new`);
    }
    let studentAnswersArray = studentAnswers.split(",");
    const test = await Test.findById(testId);
    const resultsArray = studentAnswersArray.map((answer, index) => { return answer === test.answerKey[index]? 1 : 0});
    const score = resultsArray.reduce((partialSum, a) => partialSum + a, 0) / studentAnswersArray.length * 100;
    const submission = new Submission({student, studentAnswersArray, test, resultsArray, score});
    test.submissions.push(submission);
    student.submissions.push(submission);
    await test.save();
    await student.save();
    await submission.save();
    req.flash('success', 'Submission is added successfully! You can add a new one or go back to the course tests!');
    res.redirect(`/courses/${courseId}/tests/${testId}/submissions/new`);
}));

router.get('/:submissionId', async (req, res) => {
    const {id:courseId, testId, submissionId} = req.params;
    const submission = await Submission.findById(submissionId).populate({path: 'student',model: 'Student'});
    if(!submission){
        req.flash('error', 'Cannot find the requested submission!');
        return res.redirect(`/courses/${courseId}/tests/${testId}/`);
    }
    const test = await Test.findById(testId);
    if(!test){
        req.flash('error', 'Cannot find the requested test!');
        return res.redirect(`/courses/${courseId}/tests/`);
    }
    res.render('submissions/show', {submission, test, courseId});
})

router.delete('/:submissionId', async (req, res) => {
    const {id:courseId, testId, submissionId} = req.params;
    await deleteSubmission(submissionId);
    res.redirect(`/courses/${courseId}/tests/${testId}`);
})

// router.put('/:testId', validateTest, async (req, res) => {
//     const {id , testId} = req.params;
//     const test = await Test.findByIdAndUpdate(testId, {...req.body.test})
//     req.flash('success', 'Successfully updated Test!');
//     res.redirect(`/courses/${id}/tests/`);
// })
//
// router.get('/:testId/edit', async (req, res) => {
//     const {id , testId} = req.params;
//     const test = await Test.findById(testId);
//     if(!test){
//         req.flash('error', 'Cannot find the requested test!');
//         return res.redirect(`/courses/${id}/tests`);
//     }
//     res.render('tests/edit', {test, id, testId});
// })
//


module.exports = router;
