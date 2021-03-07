const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
var session = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session);
var flash = require('connect-flash');
var store = new MongoDBStore({
    uri: 'mongodb+srv://Zook:admin@cluster0.dcakn.mongodb.net/sarahah',
    collection: 'mySessions'
});
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(flash());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))

app.use(require('./routes/index.routes'))
app.use(require('./routes/login.routes'))
app.use(require('./routes/register.routes'))
app.use(require('./routes/user.routes'))
app.use(require('./routes/messages.routes'))
app.use(require('./routes/emailverification'))
app.use(require('./routes/forgetpassword'))

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
});
mongoose.connect('mongodb+srv://Zook:admin@cluster0.dcakn.mongodb.net/sarahah',
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true,
        useFindAndModify: false
    }
)
app.listen(process.env.PORT || 3030, () => {
    console.log(`App listening on port 3030!`);
});