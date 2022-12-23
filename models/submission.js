const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
    student: {
        required: true,
        type: Schema.Types.ObjectId,
        required: true
    },
    studentAnswers: {
        type: String,
        required: true
    },
    test: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Test'
    },
    resultsArray: [{
        required: true,
        type: Number,
    }],
    score: Number

});

module.exports = mongoose.model('Submission', SubmissionSchema);