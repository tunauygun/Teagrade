const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const Course = require('./models/course');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { courseSchema } = require('./schemas');


mongoose.connect('mongodb://localhost:27017/teagrade');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCourse = (req, res, next) => {
    const { error } = courseSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/courses', async (req, res) => {
    const courses = await Course.find({});
    res.render('courses/index', { courses });
})

app.get('/courses/new', (req, res) => {
    res.render('courses/new');
})

app.post('/courses', validateCourse, catchAsync(async (req, res) => {
    const course = new Course(req.body.course);
    await course.save();
    res.redirect(`/courses/${course._id}`)
}))

app.get('/courses/:id', catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render('courses/show', { course });
}))

app.get('/courses/:id/edit', async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render('courses/edit', { course });
})

app.put('/courses/:id', validateCourse, async (req, res) => {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, { ...req.body.course })
    res.redirect(`/courses/${course._id}`);

})

app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Something went wrong!"
    res.render('error', { err });
});

app.get('/createcourse', async (req, res) => {
    const url = 'https://source.unsplash.com/collection/1368747/400x300';
    //573009
    let response = await axios.get(url);
    const course1 = await new Course({ code: "SYSC 2320", name: "Computer Systems", image: response.request.res.responseUrl });
    response = await axios.get(url);
    const course2 = await new Course({ code: "SYSC 2004", name: "Object Oriented Programming", image: response.request.res.responseUrl });
    response = await axios.get(url);
    const course3 = await new Course({ code: "SYSC 2100", name: "Data Structures and Algorithms", image: response.request.res.responseUrl });
    response = await axios.get(url);
    const course4 = await new Course({ code: "COMP 1805", name: "Discrete Structures", image: response.request.res.responseUrl });
    response = await axios.get(url);
    const course5 = await new Course({ code: "SPH3U", name: "Physics 11", image: response.request.res.responseUrl });
    response = await axios.get(url);
    const course6 = await new Course({ code: "SCH4U", name: "Chemistry 12", image: response.request.res.responseUrl });
    response = await axios.get(url);
    const course7 = await new Course({ code: "ISC3U", name: "Computer Science 11", image: response.request.res.responseUrl });
    response = await axios.get(url);
    const course8 = await new Course({ code: "LWSCU", name: "Spanish 11", image: response.request.res.responseUrl });
    response = await axios.get(url);
    const course9 = await new Course({ code: "ENG4U", name: "English 12", image: response.request.res.responseUrl });

    // await Course.deleteMany({});
    // await course1.save();
    // await course2.save();
    // await course3.save();
    // await course4.save();
    // await course5.save();
    // await course6.save();
    // await course7.save();
    // await course8.save();
    // await course9.save();

    res.redirect('/courses');

})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})
