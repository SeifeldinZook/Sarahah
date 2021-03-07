const app = require('express').Router()
const messageModel = require('../models/message.model')
const userModel = require('../models/user.model')
let userID
app.get('/user/:id', async(req, res) => {
    userID = req.params.id
    const user = await userModel.findOne({ _id: userID })
    console.log(req.session.isLoggedIn);
    res.render('user.ejs', { name: user.name, isLoggedIn: req.session.isLoggedIn })
});

app.post('/handleMessage', async(req, res) => {
    console.log(req.body);
    const { message } = req.body

    await messageModel.insertMany({ message, userID })
    res.redirect('/user/' + userID)
});

module.exports = app