const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: false
    },
    company: {
        type: 'string',
        required: false
    },
    username: {
        type: 'string',
        required: true,
        unique: true
    },
    password: {
        type: 'string',
        required: true
    }
}, {
    collection: 'user-data'
});
const User = mongoose.model('User', UserSchema);

module.exports = User;