const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "I am new",
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

UserSchema.pre('save',function(next) {
  if (!this.isModified("password")){
    return next()
  }
  bcrypt.genSalt(12, (err, salt) => {
    if (err) {
      return next(err)
    }
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err)
      }
      this.password = hash;
      next();
    });
  });
})

module.exports = mongoose.model("User", UserSchema);
