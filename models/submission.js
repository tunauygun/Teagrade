const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        required: true
    },
    studentAnswersArray: {
        required: true,
        type: [String]
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
    score: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model('Submission', SubmissionSchema);