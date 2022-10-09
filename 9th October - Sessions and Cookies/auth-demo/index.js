const express = require('express');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');

const app = express();
const PORT = 4000;

const hours24 = 24 * 60 * 60 * 1000; //24 hour cookie

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.use(sessions({
    secret: "thisismysecret",
    saveUninitialized: true,
    cookie: { maxAge: hours24 },
    resave: false
}));

app.use(cookieParser());

const validUsername = 'validuser';
const validPassword = 'validpwd';

var session;

app.listen(PORT, () => console.log("Served started at port " + PORT));

app.get('/', (req, res) => {
    session = req.session;
    if (session.userid) {
        res.send("Hi " + session.userid + "! Welcome back! <a href=\'/logout\'>Logout</a>");
    }
    else
        res.sendFile('views/index.html', { root: __dirname });
});

app.post('/userProfile', (req, res) => {
    if (req.body.username == validUsername && req.body.password == validPassword) {
        session = req.session;
        session.userid = req.body.username;
        res.send("Hi " + req.body.username + "! Welcome back! <a href=\'/logout\'>Logout</a>");
    }
    else
        res.send("Invalid details!<a href=\'/\'>Back to login</a>");

});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});