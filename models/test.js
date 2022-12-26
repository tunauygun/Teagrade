const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    course: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },
    answerKey: {
        required: true,
        type: [String]
    },
    submissions: [{
        type: Schema.Types.ObjectId,
        ref: 'Submission'
    }]

});

module.exports = mongoose.model('Test', TestSchema);