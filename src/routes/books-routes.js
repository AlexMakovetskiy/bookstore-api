const express = require("express");
const { body } = require("express-validator");

const BooksController = require("../controllers/books-controller");
const authMiddleware = require("../middleware/auth-middleware");

const router = express.Router();

router.post("/signup", body("email").isEmail(), body("password").isLength({ min: 8, max: 32 }), BooksController.signup);
router.post("/signin", body("email").isEmail(), BooksController.signin);
router.get("/getuserdata", authMiddleware, BooksController.getdata);
router.post("/logout", authMiddleware, BooksController.logout);
router.patch("/updatedata", authMiddleware, BooksController.updateData);
router.post("/sendorder", body("email").isEmail(), BooksController.subscription);
router.options("/*", BooksController.handleOptions);

module.exports = router;
