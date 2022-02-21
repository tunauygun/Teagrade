const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
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