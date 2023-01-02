if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const Course = require('./models/course');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const courseRoutes = require('./routes/courses');
const studentRoutes = require('./routes/students');
const submissionRoutes = require('./routes/submissions')
const testRoutes = require('./routes/tests');
const userRoutes = require('./routes/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const sessionConfig = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/courses/:id/tests/:testId/submissions', submissionRoutes);
app.use('/courses/:id/students', studentRoutes);
app.use('/courses/:id/tests', testRoutes)
app.use('/courses', courseRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

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
    await course1.save();
    await course2.save();
    await course3.save();
    await course4.save();
    await course5.save();
    await course6.save();
    await course7.save();
    await course8.save();
    await course9.save();

    req.user.courses.push(course1);
    req.user.courses.push(course2);
    req.user.courses.push(course3);
    req.user.courses.push(course4);
    req.user.courses.push(course5);
    req.user.courses.push(course6);
    req.user.courses.push(course7);
    req.user.courses.push(course8);
    req.user.courses.push(course9);
    await req.user.save();
    
    res.redirect('/courses');
})

app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Something went wrong!"
    res.render('error', { err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
})
