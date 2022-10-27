const User = require("../models/User");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.userSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }
  const { email, password, name } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error("Email already taken");
        error.statusCode = 422;
        throw error;
      }

      const newUser = new User({
        name,
        email,
        password,
      });
      return newUser.save()
    }).then(() => {
      res.status(200).json({
        message: "Users signed up successfuly",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.userLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }

  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error("No user with that email");
        error.statusCode = 401;
        throw error;
      }
      req.user = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isMatch) => {
      if (!isMatch) {
        const error = new Error("No user with that email");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: req.user.email,
          userId: req.user._id.toString(),
        },
        process.env.SECRET_KEY.toString(),
        {
          expiresIn: "1hr",
        }
      );
      res.status(200).json({
        token: token,
        userId: req.user._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
