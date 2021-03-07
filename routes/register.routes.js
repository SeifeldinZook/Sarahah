const app = require('express').Router()
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator')
const validation = require('../validation/validation.register')
const nodemailer = require("nodemailer");
const sendgridTransport = require('nodemailer-sendgrid-transport')
var jwt = require('jsonwebtoken');
require('dotenv').config();

// let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "zookdb@gmail.com", // generated ethereal user
//       pass: "", // generated ethereal password
//     },
// });
let transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key:`${process.env.sendGridApiKey}`
    },
}));

app.get('/register', (req, res) => {
    var oldInputs = req.flash('oldInputs')[0];
    if (oldInputs == undefined) {
        oldInputs = { name: '', email: '', password: '', PasswordConfirmation: '' }
    }
    res.render('register.ejs', { errors: req.flash('errors'), isLoggedIn: req.session.isLoggedIn, oldInputs })
});

app.post('/handleRegister', validation,
    async(req, res) => {
        const errors = validationResult(req)
        console.log(errors.array());
        // console.log(errors.isEmpty());
        console.log(req.body);
        const { name, email, password } = req.body
        if (errors.isEmpty()) {
            const user = await userModel.findOne({email});
            if (user == null) {
                console.log(user);
                bcrypt.hash(password, 8, async function(err, hash) {
                    var token = jwt.sign({email}, 'shhhhh', { expiresIn: 60 * 5 });
                    let info = await transporter.sendMail({
                        from: '"Sarahah" <zookdb@gmail.com>', // sender address
                        to: email, // list of receivers
                        subject: "No Reply: Email Verification ✔", // Subject line
                        html: `
                        <h2>This is an automated message!</h2>
                        <br>
                        <b>Your Email is:</b> <span>${email}</span>
                        <br>
                        <a href="https://sarahahapp.herokuapp.com/verify/${token}">Click to verify your Email</a>
                        `,
                    });
                    await userModel.insertMany({ name, email, password: hash, imgURL: '/img/userDefault.jpg'})
                    res.redirect('/emailverification')
                });
            } else {
                req.flash('errors', 'emailExists')
                req.flash('oldInputs', req.body)
                res.redirect('/register')
            }
        } else {
            req.flash('errors', errors.array())
            req.flash('oldInputs', req.body)
            res.redirect('/register')
        }
});

app.get('/verify/:token', (req, res) => {
    let token = req.params.token
    let decoded = jwt.verify(token, 'shhhhh');
    jwt.verify(token, 'shhhhh', async function(err, decoded) {
        console.log(decoded.email);
        await userModel.findOneAndUpdate({email: decoded.email}, {emailVerification: true})
    });
    res.redirect('/login')
});
module.exports = app
