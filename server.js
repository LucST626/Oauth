const dotenv = require('dotenv');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const port = 3000;

dotenv.config();

const CLIENT_ID_GITHUB = process.env.CLIENT_ID_GITHUB;
const CLIENT_SECRET_GITHUB = process.env.CLIENT_SECRET_GITHUB;
const CLIENT_ID_GOOGLE = process.env.CLIENT_ID_GOOGLE;
const CLIENT_SECRET_GOOGLE = process.env.CLIENT_SECRET_GOOGLE;


passport.use(new GitHubStrategy({
  clientID: CLIENT_ID_GITHUB,
  clientSecret: CLIENT_SECRET_GITHUB,
  callbackURL: "http://localhost:3000/auth/github/callback"
},
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.use(new GoogleStrategy({
    clientID: CLIENT_ID_GOOGLE,
    clientSecret: CLIENT_SECRET_GOOGLE,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  ));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

const app = express();

app.use(session({
    secret: "secrete",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }

app.get("/", (req, res) => {
    const html = "<a href='/auth/github'>Login with Github</a>";
  res.send(html);
});

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
passport.authenticate('github', { failureRedirect: '/' }),
function (req, res) {
    res.redirect('/');
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['user:email'] }));
  
  app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
      res.redirect('/');
  });

app.get('/profile',ensureAuthenticated , (req, res) => {
    res.send(`Hello ${req.user.username} || ${req.user.displayName}`);
    });

app.get('/logout', (req, res) => {
    req.logout(done => {
      console.log('Logout');
    }
    );
    res.redirect('/');
    });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});