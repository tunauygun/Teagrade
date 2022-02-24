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
            ref: 'Student'
        }
    ],
    tests: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Test'
        }
    ]

});

module.exports = mongoose.model('Course', CourseSchema);