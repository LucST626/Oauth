const dotenv = require('dotenv');
const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}
);