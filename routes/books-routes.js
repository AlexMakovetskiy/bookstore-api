const express = require('express');
const { body } = require('express-validator');

const BooksController = require('../controllers/books-controller');
const authMiddleware = require('../middleware/auth-middleware');

const router = express.Router();

router.post(
    '/signup',
    body('email').isEmail(),
    body('password').isLength({min: 8, max: 32}),
    BooksController.signup,
);
router.post('/signin', BooksController.signin);
router.get('/getuserdata', authMiddleware, BooksController.getdata);
router.patch('/updatedata', authMiddleware, BooksController.updateData);
router.post('/logout', authMiddleware, BooksController.logout);
router.post('/sendorder', body('email').isEmail(), BooksController.subscription);
router.options('/*', BooksController.handleOptions);

module.exports = router; 