const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    submissions: [{
        type: Schema.Types.ObjectId,
        ref: 'submission'
    }]

});

module.exports = mongoose.model('Student', StudentSchema);