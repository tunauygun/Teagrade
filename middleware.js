const ExpressError = require('./utils/ExpressError');
const {courseSchema, studentSchema, testSchema} = require('./schemas.js');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthorized = async (req, res, next) => {
    const {id: courseId} = req.params;
    if (!req.user.courses.includes(courseId)) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You don't have permission to access this page!");
        return res.redirect('/courses');
    }
    next();
}

module.exports.validateCourse = (req, res, next) => {
    const { error } = courseSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateStudent = (req, res, next) => {
    const { error } = studentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateTest = (req, res, next) => {
    req.body.test.answerKey = req.body.answerKey;
    delete req.body.answerKey;
    const {error} = testSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}