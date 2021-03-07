const { check } = require('express-validator')

module.exports = [
    check('name').matches(/^([a-zA-Z]+\s)*[a-zA-Z]+$/),
    check('email').isEmail(),
    check('password').notEmpty(),
    check('PasswordConfirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            return false
        }
        return true;
    })
]