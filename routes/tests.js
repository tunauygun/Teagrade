const express = require('express');
const Course = require('../models/course');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateTest, isAuthorized} = require('../middleware');
const Test = require("../models/test");
const Submission = require("../models/submission");
const {deleteTest} = require("../utils/delete");

const router = express.Router({mergeParams: true});

router.use(isLoggedIn);
router.use(isAuthorized);

router.get('/', catchAsync( async (req, res) => {
    const {tests} = await Course.findById(req.params.id).populate('tests');
    const courseId = req.params.id;
    res.render('tests/index', {courseId, tests});
}));

router.get('/new', (req, res) => {
    const courseId = req.params.id;
    res.render('tests/new', {courseId});
});

router.post('/', validateTest, catchAsync(async (req, res) => {
    const {name, answerKey} = req.body.test;
    const course = await Course.findById(req.params.id)
    const test = new Test({name, course, answerKey});
    await test.save();
    course.tests.push(test);
    await course.save();
    req.flash('success', `Successfully added ${test.name} to the course!`);
    res.redirect(`/courses/${course._id}/tests`);
}));

router.put('/:testId', validateTest, catchAsync(async (req, res) => {
    const {id , testId} = req.params;
    await Test.findByIdAndUpdate(testId, {...req.body.test})
    const test = await Test.findById(testId).populate({
        path: 'submissions',
        populate: { path: 'student', model: 'Student'}
    });
    for (let i = 0; i < test.submissions.length; i++) {
        const student = test.submissions[i].student;
        const studentAnswersArray = test.submissions[i].studentAnswersArray;
        const submission = await Submission.findById(test.submissions[i]);
        const resultsArray = studentAnswersArray.map((answer, index) => { return answer === test.answerKey[index]? 1 : 0});
        const score = (resultsArray.reduce((partialSum, a) => partialSum + a, 0) / studentAnswersArray.length) * 100;
        await Submission.findByIdAndUpdate(test.submissions[i]._id, {student, studentAnswersArray, test, resultsArray, score});
    }
    req.flash('success', 'Successfully updated Test!');
    res.redirect(`/courses/${id}/tests/`);
}));

router.get('/:testId/edit', catchAsync(async (req, res) => {
    const {id , testId} = req.params;
    const test = await Test.findById(testId);
    if(!test){
        req.flash('error', 'Cannot find the requested test!');
        return res.redirect(`/courses/${id}/tests`);
    }
    res.render('tests/edit', {test, id, testId});
}));

router.get('/:testId', catchAsync(async (req, res) => {
    const test = await Test.findById(req.params.testId).populate({
        path: 'submissions',
        populate: { path: 'student', model: 'Student'}
    });
    const courseId = req.params.id;
    if(!test){
        req.flash('error', 'Cannot find the requested test!');
        return res.redirect(`/courses/${courseId}/tests/`);
    }
    let answers = "";
    for (let i = 0; i < test.answerKey.length; i++) {
        answers += i+1 + test.answerKey[i]+ " "
    }
    test.answersString = answers;
    res.render('tests/show', {test, courseId});
}));

router.delete('/:testId', catchAsync(async (req, res) => {
    const {id:courseId, testId} = req.params;
    await deleteTest(testId);
    res.redirect(`/courses/${courseId}/tests`);
}));

module.exports = router;
