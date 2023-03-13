const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    name: {type: String, require:true},
    email: { type: String, require: true},
    password: {type: String, require:true},
    age: {type: Number},
    phone: {type: Number}
},
{
    timestamps:true,
});

const User = mongoose.model('User', usersSchema);

module.exports = User;