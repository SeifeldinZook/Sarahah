const app = require('express').Router();

app.get('/emailverification', (req, res) => {
  res.render('emailverification.ejs', {isLoggedIn: false})
});

module.exports = app