const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
    studentId: {
        type: Number,
        required: true
    },
    studentAnswers: {
        type: String,
        required: true
    },
    test: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'test'
    },
    resultsArray: [{
        required: true,
        type: Number,
    }],
    score: Number

});

module.exports = mongoose.model('Submission', SubmissionSchema);