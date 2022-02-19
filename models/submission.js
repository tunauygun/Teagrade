const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
    studentId: Number,
    studentAnswers: String,
    test: {
        type: Schema.Types.ObjectId,
        ref: 'test'
    },
    resultsArray: [{
        type: Number,
    }],
    score: Number

});

module.exports = mongoose.model('Submission', SubmissionSchema);