const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true
    },
    address:{
        type:'string',
        required:true
    },
    country:{
        type:'string',
        required:true
    },
    dob:{
        type:'string',
        required:true
    },
    contactNo:{
        type:'string',
        required:true
    },
    accountType:{
        type:'string',
        required:true
    },
    branchName:{
        type:'string',
        required:true
    },
    initialDepositAmount:{
        type:'string',
        required:true
    },
    identificationProofType:{
        type:'string',
        required:true
    },
    identificationDocumentNo:{
        type:'string',
        required:true
    },
    email: {
        type: 'string',
        required: true,
        unique:true
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