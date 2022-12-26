const express = require('express');
const Course = require('../models/course');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateTest, validateStudent} = require('../middleware');
const Test = require("../models/test");
const Student = require("../models/student");
const Submission = require("../models/submission");

const router = express.Router({mergeParams: true});

router.get('/',isLoggedIn, catchAsync( async (req, res) => {
    const {tests} = await Course.findById(req.params.id).populate('tests');
    const courseId = req.params.id;
    res.render('tests/index', {courseId, tests});
}));

router.get('/new', isLoggedIn, (req, res) => {
    const courseId = req.params.id;
    res.render('tests/new', {courseId});
});

router.post('/', isLoggedIn, validateTest, catchAsync(async (req, res) => {
    const {name, answerKey} = req.body.test;
    const course = await Course.findById(req.params.id)
    const test = new Test({name, course, answerKey});
    await test.save();
    course.tests.push(test);
    await course.save();
    req.flash('success', `Successfully added ${test.name} to the course!`);
    res.redirect(`/courses/${course._id}/tests`);
}));

router.put('/:testId', validateTest, async (req, res) => {
    const {id , testId} = req.params;
    const test = await Test.findByIdAndUpdate(testId, {...req.body.test})
    req.flash('success', 'Successfully updated Test!');
    res.redirect(`/courses/${id}/tests/`);
})

router.get('/:testId/edit', async (req, res) => {
    const {id , testId} = req.params;
    const test = await Test.findById(testId);
    if(!test){
        req.flash('error', 'Cannot find the requested test!');
        return res.redirect(`/courses/${id}/tests`);
    }
    res.render('tests/edit', {test, id, testId});
})

router.get('/:testId', async (req, res) => {
    const test = await Test.findById(req.params.testId).populate('submissions');
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
})

module.exports = router;
