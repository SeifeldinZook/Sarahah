const app = require('express').Router()

app.get('/', (req, res) => {
    if (req.session.isLoggedIn == true) {
        res.redirect('/messages')
    } else {
        res.render('index.ejs', { isLoggedIn: req.session.isLoggedIn })
    }
});


module.exports = app