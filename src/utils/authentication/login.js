// const passport = require("passport");
const LocalStrategy = require('passport-local');
const bcrypt= require('bcrypt');
const User = require('../../api/users/users.model');

const { validEmail, validPassword } = require('../helpers/validators');

const loginStrategy = new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
},
 async (req, email, password, done) => {
    if(!validEmail(email) || !validPassword(password)) {
        const error = new Error('email or password format not valid')
        return done(error, null);
    }

    const existingUser = await User.findOne({email});

    if (!existingUser) {
        const error = new Error('user does not exist');
        return done(error, null);        
    }

    const validUserPassword = await bcrypt.compare(password, existingUser.password);

    if (!validUserPassword) {
        const error = new Error('the password does not match');
        error.status = 401;
        return done(error, null);
    }

    existingUser.password = null;
    return done(null, existingUser);
 })

module.exports = loginStrategy;