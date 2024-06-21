const { check, validationResult } = require("express-validator");

exports.userValidation = [
    check('name', 'Name is required').notEmpty().isLength({ min: 3 }).withMessage('name length must be more than 3 characters'),
    check('location', 'Loaction is required').notEmpty().isLength({ min: 4 }).withMessage('Enter full Location Detail'),
    check('email').notEmpty().isLength({ min: 12 }).isEmail().withMessage('Invalid Email'),
    check('password', 'Invalid password').notEmpty()
        .matches(/[a-z]/).withMessage('password must contain at least one character')
        .matches(/[0-9]/).withMessage('password must contain  a numeric')
        .isLength({ min: 8 }).withMessage('Use atleast 8 characetr for password')
]


exports.passwordValidation = [
    check('password', 'Invalid password').notEmpty()
        .matches(/[a-z]/).withMessage('password must contain at least one character')
        .matches(/[0-9]/).withMessage('password must contain  a numeric')
        .isLength({ min: 8 }).withMessage('Use atleast 8 characetr for password')
]

exports.emailValidation = [
    check('email').notEmpty().isLength({ min: 12 }).isEmail().withMessage('Invalid Email'),
]


exports.validation = (req, res, next) => {
    const error = validationResult(req)
    if (error.isEmpty()) {
        next()
    }
    else {
        return res.status(400).json({ error: error.array().msg })
    }
}