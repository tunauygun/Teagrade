const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    submissions: [{
        type: Schema.Types.ObjectId,
        ref: 'Submission'
    }]

});

module.exports = mongoose.model('Student', StudentSchema);