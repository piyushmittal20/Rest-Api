const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');

const User = require('../models/user');
const authController = require('../controllers/auth');
const router = express.Router();

router.put('/signup',
    [
        body('email')
            .isEmail()
            .withMessage("Please Enter a valid email.")
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject("E=Mail address already exist")
                        }
                    })
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 }),
        body('name')
            .trim()
            .not()
            .isEmpty()
    ],
    authController.signup
)

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getStatus);

router.patch('/status', isAuth,
    [
        body('status')
            .trim()
            .not()
            .isEmpty()
    ],
    authController.updateStatus);

module.exports = router;