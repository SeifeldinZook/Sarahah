# Sarahah App

A modern, secure anonymous messaging platform built with Node.js, Express, and MongoDB. Users can create profiles and receive anonymous messages from others, similar to the original Sarahah concept.

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **Anonymous Messaging**: Send and receive anonymous messages
- **Email Verification**: Account verification via email
- **Password Recovery**: Forgot password functionality
- **Session Management**: Secure session handling with MongoDB
- **Professional Logging**: Winston-based logging system with file rotation
- **Responsive Design**: Modern UI with EJS templates
- **Production Ready**: Configured for VPS deployment with SSL

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: bcrypt, express-session
- **Email**: Nodemailer with SendGrid
- **Templates**: EJS
- **Logging**: Winston
- **Validation**: express-validator

## 📋 Prerequisites

- Node.js >= 20.13.1
- MongoDB Atlas account
- SendGrid account (for email functionality)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/SeifeldinZook/Sarahah.git
cd Sarahah
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the `config/` directory:

```env
NODE_ENV=development
PORT=3030
# Add your MongoDB and SendGrid credentials here
```

### 4. Start the Application

```bash
npm start
```

The app will be available at `http://localhost:3000`

## 🗄️ Database Configuration

The app uses MongoDB Atlas for data storage. Update the connection strings in `app.js`:

```javascript
// MongoDB connection string
mongodb+srv://username:password@cluster.mongodb.net/database_name
```

## 📧 Email Configuration

Configure SendGrid for email functionality:

1. Create a SendGrid account
2. Generate an API key
3. Update the email configuration in your routes

## 🚀 Deployment

### VPS Deployment (Production)

The app is configured for VPS deployment with:

- **PM2** for process management
- **Apache2** for reverse proxy
- **SSL certificates** via Letbot
- **Professional logging** with Winston

#### Deployment Steps

1. Clone repository to `/var/www/Sarahah`
2. Install dependencies: `npm install`
3. Configure PM2: `PORT=3001 pm2 start app.js --name sarah`
4. Set up Apache2 virtual host with SSL
5. Configure DNS A record

For detailed deployment instructions, see `sarah-app-deployment-guide.md`.

## 📁 Project Structure

```text
Sarahah/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── routes/               # Express routes
│   ├── index.routes.js   # Home page routes
│   ├── login.routes.js   # Authentication routes
│   ├── register.routes.js # User registration
│   ├── user.routes.js    # User profile routes
│   ├── messages.routes.js # Message handling
│   ├── emailverification.js # Email verification
│   └── forgetpassword.js # Password recovery
├── views/                # EJS templates
├── public/               # Static assets
├── logs/                 # Winston log files
└── config/               # Configuration files
```

## 🔧 Configuration

### Environment Variables

- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3000)

### Logging

The app uses Winston for professional logging:

- **Development**: Verbose console output + file logging
- **Production**: Minimal console output + JSON file logging
- **Log Files**: `logs/app.log` and `logs/errors.log`
- **Rotation**: 5MB max size, keeps 5 rotated files

## 🛡️ Security Features

- Password hashing with bcrypt
- Session management with MongoDB store
- CSRF protection
- Input validation with express-validator
- Secure headers and CORS configuration

## 📊 Monitoring

The app includes comprehensive logging and monitoring:

- Request/response logging
- Error tracking
- Performance monitoring
- File-based log rotation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🔗 Links

- **Live Demo**: [https://sarahah.zook.blog](https://sarahah.zook.blog)
- **Repository**: [https://github.com/SeifeldinZook/Sarahah](https://github.com/SeifeldinZook/Sarahah)

## 📞 Support

For support or questions, please open an issue on GitHub or contact the maintainer.

---

**Note**: This project was successfully migrated from Heroku to a VPS deployment, saving ~$84 annually while improving performance and control.
