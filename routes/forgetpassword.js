const app = require('express').Router();
const userModel = require('../models/user.model');
const nodemailer = require("nodemailer");
const sendgridTransport = require('nodemailer-sendgrid-transport')
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
require('dotenv').config();

// let transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "zookdb@gmail.com", // generated ethereal user
//     pass: "", // generated ethereal password
//   },
// });
let transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
      api_key:`${process.env.sendGridApiKey}`
  },
}));

app.get('/forgetpassword', (req, res) => {
  res.render('forgetpassword.ejs', {isLoggedIn: false})
});

app.post('/handleforgetpassword', async (req, res) => {
  const email = req.body.email;
  var token = jwt.sign({email}, 'shhhhh', { expiresIn: 60 * 5 }); // expires after 60sec * 5

  let info = await transporter.sendMail({
      from: '"Sarahah" <zookdb@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "No Reply: Reset Password ✔", // Subject line
      html: `
      <h2>This is an automated message!</h2>
      <br>
      <b>Your Email is:</b> <span>${email}</span>
      <br>
      <a href="https://sarahahapp.herokuapp.com/resetpassword/${token}">Click to reset your password</a>
      `, // html body
  });
  res.redirect('/forgetpassword')
});

app.get('/resetpassword/:token', async (req, res) => {
  let token = req.params.token
  jwt.verify(token, 'shhhhh', async function(err, decoded) {
    const user = await userModel.findOne({email: decoded.email});
    res.render('resetpassword.ejs', {isLoggedIn: false, error: [], newPassword:''})
  });
});

app.post('/handleResetPassword', 
  check('newPassword').notEmpty(),
  check('rePassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  async (req, res) => {
    const newPassword = req.body.newPassword;
    const error = validationResult(req);
    
    let url = req.rawHeaders.filter(str => str.match('/resetpassword/')).toString()
    let urlSplit = url.split("/");
    let token = urlSplit[urlSplit.length - 1]
    let decoded = jwt.verify(token, 'shhhhh');
    let user = await userModel.findOne({email: decoded.email});

    console.log(user)
    console.log(error.array());
    console.log(newPassword);
    if (error.isEmpty()) {
      bcrypt.hash(newPassword, 7, async (err, hash) => {
        await userModel.findOneAndUpdate({email: decoded.email}, {password: hash})
        res.redirect('/')
      })
    } else {
      res.render('resetpassword.ejs', {isLoggedIn: false, error: error.array(), newPassword})
    }
  }
);

module.exports = app
