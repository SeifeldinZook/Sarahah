const app = require('express').Router()
const messageModel = require('../models/message.model')
app.get('/messages', async(req, res) => {
    if (req.session.isLoggedIn == true) {
        const messages = await messageModel.find({ userID: req.session.userID })
        const fullURL = req.protocol + '://' + req.headers.host + '/user/' + req.session.userID
        res.render('messages.ejs', { messages, name: req.session.name, fullURL, isLoggedIn: req.session.isLoggedIn })
    } else {
        res.redirect('/login')
    }
});


module.exports = app