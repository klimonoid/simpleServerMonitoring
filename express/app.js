// global requirements
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require("express-session");
const flash = require('express-flash');
const passport = require('passport');


// local routes requirements
const testRouter = require('./routes/testRoutes');
const authRouter = require('./routes/authorization');
const serverRouter = require('./routes/server');
const { SESSION_SECRET } = require('../config/session.conf');
const initializePassport = require('./passportConfig');

const app = express();

const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8081');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.header('Access-Control-Allow-Credentials', true);
    next();
}
app.use(allowCrossDomain);

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 360000,  secure: false }
    })
);
app.use(passport.initialize({}));
// Store our variables to be persisted across the whole session.
// Works with app.use(Session) above
app.use(passport.session({}));
initializePassport(passport);

// using the middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());


// include all routes
app.use('', authRouter);
app.use('', serverRouter);
app.use('', testRouter);

module.exports = app;