const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./config');
const router = require('express').Router();
const Session = require('./config');



const app = express();

//session middleware
const session = require('express-session');
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

// convert data into JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// use ejs as view engine
app.set('view engine', 'ejs');

// static files
app.use(express.static('public'));


app.get('/', (req,res) => {
    res.render('login');
});


app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    // check if user already exists
    const userExists = await User.findOne({ email: data.email });
    if (userExists) {
        return res.status(400).json({ error: 'Email already exists. Try logging in' });
    } else {
        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        // Create new user
        const user = new User(data);
        await user.save();
        

        // Send welcome email
        // sendEmail(data.email, 'Welcome to Task Manager', `Hello, ${data.name}! Thank you for signing up for Task Manager.`);

        // Redirect to login page
        res.redirect('http://localhost:3000/');

        // Store user in local storage
        // const users = JSON.parse(localStorage.getItem('users')) || [];
        // users.push(data);
        // localStorage.setItem('users', JSON.stringify(users));

    }
    
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            alert('User not found');
            return res.redirect('/signup');
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (isMatch) {
            // Store user in session
            req.session.user_sid = JSON.stringify(user);
            // redirect to home page
            res.render('home');
        } else {
            res.status(400).json({ error: 'Invalid email or password' });
        }

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});


// home page
app.get('/home', async (req, res) => {
    res.render('home');
});


// logout
app.get('/logout', (req, res) => {
    res.clearCookie('user_sid');
    res.redirect('/');
});

module.exports = router;

const port = 3000;
app.listen(port, () => console.log('listening on port ' + port));