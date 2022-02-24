const express = require('express');
const Course = require('../models/course');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateCourse} = require('../middleware');

const router = express.Router({mergeParams: true});

router.get('/', (req, res) => {
    res.send('tests')
});

module.exports = router;
