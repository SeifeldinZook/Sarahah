const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
var session = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session);
var flash = require('connect-flash');

// Load .env file FIRST before any other operations
const envPath = path.join(__dirname, 'config/.env');
const result = require('dotenv').config({ path: envPath });
if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('Environment configuration loaded successfully');
}

// Winston logging imports
const { createLogger, format, transports } = require('winston');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Environment-specific database configuration
const isProduction = process.env.NODE_ENV === 'production' || 
                     process.env.ENVIRONMENT === 'production' ||
                     process.env.APP_ENV === 'production';
const dbSuffix = isProduction ? 'prod' : 'dev';
const sessionDbName = `sarahah_sessions_${dbSuffix}`;
const appDbName = `sarahah_app_${dbSuffix}`;

// Debug logging for environment detection
console.log('Environment Detection Debug:', {
    NODE_ENV: process.env.NODE_ENV,
    ENVIRONMENT: process.env.ENVIRONMENT,
    APP_ENV: process.env.APP_ENV,
    isProduction: isProduction,
    dbSuffix: dbSuffix,
    sessionDbName: sessionDbName,
    appDbName: appDbName
});

var store = new MongoDBStore({
    uri: `mongodb+srv://zookdb_db_user:0UIku8VhrH0pCdYZ@cluster0.lmgjdnw.mongodb.net/${sessionDbName}?retryWrites=true&w=majority&appName=Cluster0&ssl=true&tlsAllowInvalidCertificates=true`,
    collection: 'mySessions'
});

// Setup Winston logger with environment-specific configuration

const logger = createLogger({
  level: isProduction ? 'warn' : 'info', // Less verbose in production
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // Include stack traces
    isProduction 
      ? format.json() // JSON format for production (easier parsing)
      : format.printf( // Human-readable for development
          ({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
            const messageStr = typeof message === 'object' ? JSON.stringify(message) : String(message);
            return `${timestamp} [${level.toUpperCase()}]: ${messageStr} ${metaStr}`;
          }
        )
  ),
  transports: [
    // Console output (less verbose in production)
    new transports.Console({
      level: isProduction ? 'error' : 'debug',
      silent: process.env.NODE_ENV === 'test' // Silence in test environment
    }),
    // Application logs
    new transports.File({ 
      filename: path.join(logDir, 'winston.app.log'),
      level: 'info',
      maxsize: 5 * 1024 * 1024, // 5MB max file size
      maxFiles: 3
    }),
    // Error logs
    new transports.File({
      filename: path.join(logDir, 'winston.error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3
    }),
  ],
});

// Override console.log and console.error to use Winston
console.log = function (message, ...args) {
    logger.info(message, ...args);
};

console.error = function (message, ...args) {
    logger.error(message, ...args);
};

// .env file already loaded at the beginning of the file

// Normalize port
const normalizePort = require('normalize-port');
const port = normalizePort(process.env.PORT || 3000);

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
mongoose.connect(`mongodb+srv://zookdb_db_user:0UIku8VhrH0pCdYZ@cluster0.lmgjdnw.mongodb.net/${appDbName}?retryWrites=true&w=majority&appName=Cluster0&ssl=true&tlsAllowInvalidCertificates=true`)

// Start the server
app.listen(process.env.PORT || port, () => {
    const environment = process.env.NODE_ENV || 'development';
    logger.info('Sarahah app server started', {
        port: process.env.PORT || port,
        environment: environment,
        url: environment === 'production' ? 'https://sarahah.zook.blog' : `http://localhost:${port}`,
        databases: {
            session: sessionDbName,
            app: appDbName
        }
    });
});