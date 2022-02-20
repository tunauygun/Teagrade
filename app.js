const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const Course = require('./models/course');


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
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/courses', async (req, res) => {
    const courses = await Course.find({});
    res.render('courses/index', {courses});
})

app.get('/courses/new', (req, res) => {
    res.render('courses/new');
})

app.post('/courses', async (req, res) => {
    const course = new Course(req.body.course);
    await course.save();
    res.redirect(`/courses/${course._id}`)
})

app.get('/courses/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render('courses/show', {course});
})

app.get('/courses/:id/edit', async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render('courses/edit', {course});
})

app.put('/courses/:id', async (req, res) => {
    const {id} = req.params;
    const course = await Course.findByIdAndUpdate(id, {...req.body.course})
    res.redirect(`/courses/${course._id}`);

})

app.get('/createcourse', async (req, res) => {
    const course1 = new Course({code: "SYSC 2320", name: "Computer Systems"});
    const course2 = new Course({code: "SYSC 2004", name: "Object Oriented Programming"});
    const course3 = new Course({code: "SYSC 2100", name: "Data Structures and Algorithms"});
    const course4 = new Course({code: "COMP 1805", name: "Discrete Structures"});
    //await course1.save();
    //await course2.save();
    //await course3.save();
    //await course4.save();
    res.send('Courses are added!');
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})
