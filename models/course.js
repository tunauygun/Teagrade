const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    code: String,
    name: String,
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'student'
        }
    ],
    tests: [
        {
            type: Schema.Types.ObjectId,
            ref: 'test'
        }
    ]

});

module.exports = mongoose.model('Course', CourseSchema);