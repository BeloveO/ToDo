const mongoose = require('mongoose');
const { unique } = require('next/dist/build/utils');
require('dotenv').config();

const connect = mongoose.connect(process.env.MONGO_URI);

// check if database is connected
connect.then(() => {
    console.log('Connected to MongoDB');
});

// check if connection failed
connect.catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

// create schema
const userSchema = new mongoose.Schema({
    name: {type: 'string', required: true, unique: true},
    email: {type: 'string', required: true, unique: true},
    password: {type: 'string', required: true},
    // schema for todo // optional fields
    tasks: [new mongoose.Schema({
        title: {type: 'string', required: true},
        description: {type: 'string'},
        completed: {type: 'boolean', default: false},
        dueDate: {type: 'date'}
    })]  // optional subdocument
});


// create model
const User = mongoose.model('users', userSchema);


module.exports = User;