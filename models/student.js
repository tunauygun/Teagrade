const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    firstName: String,
    lastName: String,
    number: Number,
    submissions: [{
        type: Schema.Types.ObjectId,
        ref: 'submission'
    }]

});

module.exports = mongoose.model('Student', StudentSchema);