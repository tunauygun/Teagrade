const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    class: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'class'
    },
    asnwers: {
        required: true,
        type: [Number]
    }

});

module.exports = mongoose.model('Test', TestSchema);