const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");

router.post(
  "/signup",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").not().isEmpty().isLength({ min: 5 }),
  ],
  authController.userSignup
);

module.exports = router;
