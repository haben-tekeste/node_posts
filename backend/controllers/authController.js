const User = require("../models/User");
const { validationResult } = require("express-validator");

exports.userSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }
  const { email, password , name } = req.body;
  User.findOne({ email }).then(user => {
    if (user) {
        const error = new Error("Email already taken");
        error.statusCode = 422;
        throw error;
    }
    const newUser = new User({
        name,email,password
    });
    return newUser.save()
  }).then(result => {
        res.status(200).json({
            message:"Users signed up successfuly"
        })
  }).catch(err => {
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  })
};
