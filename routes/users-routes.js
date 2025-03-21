const express = require('express');
const { check } = require('express-validator');

const userController = require('../controllers/users-controller');
const router = express.Router();


//Register new User and Validate input data
router.post('/register',
    [
        check('name', 'Please provide a name').not().isEmpty().isLength({ min: 4 }).trim(),
        check('email', 'Please provide an email').isEmail().not().isEmpty().isLength({ min: 6 }).normalizeEmail(),
        check('password', 'Password at least 6 character long').isLength({ min: 6 }).trim()
    ],
    userController.registerUser
);

//Login a User and Validate input Data
router.post('/login',
    [
        check('email', 'Please provide an email').isEmail().not().isEmpty().isLength({ min: 6 }).normalizeEmail(),
        check('password', 'Password at least 6 character long').isLength({ min: 6 }).trim()
    ],
    userController.loginUser
);

router.post("/reset-password", userController.resetPassword)

module.exports = router;