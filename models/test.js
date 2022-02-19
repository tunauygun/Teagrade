const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = new Schema({
    name: String,
    data: String,
    class: {
        type: Schema.Types.ObjectId,
        ref: 'class'
    },
    asnwers: {
        type: [Number]
    }

});

module.exports = mongoose.model('Test', TestSchema);