const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Teagrade!');
            res.redirect('/courses');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    const redirectUrl = req.session.returnTo || '/courses';
    req.flash('success', 'Welcome back!');
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Goodbye!');
    res.redirect('/');
});

module.exports = router;